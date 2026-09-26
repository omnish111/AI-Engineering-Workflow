/**
 * Task Graph Validator & Manager (V2)
 * 
 * Validates task DAG integrity, detects circular dependencies,
 * finds ready/blocked tasks, and propagates completion.
 * 
 * Usage:
 *   node .ai/scripts/task-graph.js validate    — Validate task graph integrity
 *   node .ai/scripts/task-graph.js ready       — List tasks ready for execution
 *   node .ai/scripts/task-graph.js blocked     — List blocked tasks
 *   node .ai/scripts/task-graph.js parallel    — List parallelizable ready tasks
 *   node .ai/scripts/task-graph.js status      — Print task graph summary
 *   node .ai/scripts/task-graph.js complete <taskId>  — Mark task complete & propagate
 *   node .ai/scripts/task-graph.js fail <taskId> <reason>  — Mark task failed
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

const tasksPath = path.join(__dirname, '../state/tasks.json');

const { writeJsonAtomic, appendEvent } = require('./state-io');

function loadTasks() {
  if (!fs.existsSync(tasksPath)) {
    log('No tasks.json found at ' + tasksPath, colors.red);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  } catch (e) {
    log('Error parsing tasks.json: ' + e.message, colors.red);
    process.exit(1);
  }
}

function saveTasks(data, expectedRevision = null) {
  writeJsonAtomic(tasksPath, data, expectedRevision);
  log(`Tasks saved atomically (revision ${data.revision}).`, colors.green);
}

// ─── Validation ───

function validateUniqueIds(tasks) {
  const ids = new Set();
  const duplicates = [];
  for (const task of tasks) {
    if (ids.has(task.id)) {
      duplicates.push(task.id);
    }
    ids.add(task.id);
  }
  return duplicates;
}

function validateDependencyRefs(tasks) {
  const ids = new Set(tasks.map(t => t.id));
  const unresolved = [];
  for (const task of tasks) {
    if (task.dependsOn) {
      for (const dep of task.dependsOn) {
        if (!ids.has(dep)) {
          unresolved.push({ task: task.id, missingDep: dep });
        }
      }
    }
  }
  return unresolved;
}

function detectCircularDeps(tasks) {
  const graph = {};
  for (const task of tasks) {
    graph[task.id] = task.dependsOn || [];
  }

  const visited = new Set();
  const inStack = new Set();
  const cycles = [];

  function dfs(node, path) {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node);
      cycles.push(path.slice(cycleStart).concat(node));
      return;
    }
    if (visited.has(node)) return;

    visited.add(node);
    inStack.add(node);
    path.push(node);

    for (const dep of (graph[node] || [])) {
      dfs(dep, [...path]);
    }

    inStack.delete(node);
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      dfs(task.id, []);
    }
  }

  return cycles;
}

function validate(data) {
  const tasks = data.tasks || [];
  let errors = 0;

  log('\n═══ Task Graph Validation ═══\n', colors.bold + colors.blue);

  // 1. Unique IDs
  const dupes = validateUniqueIds(tasks);
  if (dupes.length > 0) {
    log(`✘ Duplicate task IDs: ${dupes.join(', ')}`, colors.red);
    errors += dupes.length;
  } else {
    log('✔ All task IDs are unique', colors.green);
  }

  // 2. Dependency references
  const unresolved = validateDependencyRefs(tasks);
  if (unresolved.length > 0) {
    for (const u of unresolved) {
      log(`✘ Task ${u.task} depends on unknown task ${u.missingDep}`, colors.red);
    }
    errors += unresolved.length;
  } else {
    log('✔ All dependency references are valid', colors.green);
  }

  // 3. Circular dependencies
  const cycles = detectCircularDeps(tasks);
  if (cycles.length > 0) {
    for (const cycle of cycles) {
      log(`✘ Circular dependency: ${cycle.join(' → ')}`, colors.red);
    }
    errors += cycles.length;
  } else {
    log('✔ No circular dependencies detected', colors.green);
  }

  // 4. Schema validation
  let schemaErrors = 0;
  for (const task of tasks) {
    if (!task.id) { log(`✘ Task missing ID`, colors.red); schemaErrors++; }
    if (!task.description) { log(`✘ Task ${task.id} missing description`, colors.red); schemaErrors++; }
    if (!task.status) { log(`✘ Task ${task.id} missing status`, colors.red); schemaErrors++; }
  }
  if (schemaErrors === 0) {
    log('✔ All tasks have required fields', colors.green);
  }
  errors += schemaErrors;

  // Summary
  log(`\nTotal tasks: ${tasks.length}`, colors.cyan);
  log(`Validation errors: ${errors}`, errors > 0 ? colors.red : colors.green);

  return errors === 0;
}

// ─── Task Queries ───

function getReadyTasks(tasks) {
  const completedIds = new Set(
    tasks.filter(t => t.status === 'COMPLETED').map(t => t.id)
  );

  return tasks.filter(t => {
    if (t.status !== 'PENDING' && t.status !== 'READY') return false;
    const deps = t.dependsOn || [];
    return deps.every(d => completedIds.has(d));
  });
}

function getBlockedTasks(tasks) {
  return tasks.filter(t => t.status === 'BLOCKED' || t.status === 'HUMAN_REQUIRED');
}

function getParallelizableTasks(tasks) {
  const ready = getReadyTasks(tasks);
  // Check for output path conflicts
  const outputMap = {};
  const safe = [];
  const conflicts = [];

  for (const task of ready) {
    const outputs = task.outputs || [];
    let hasConflict = false;

    for (const output of outputs) {
      if (outputMap[output]) {
        conflicts.push({ task1: outputMap[output], task2: task.id, file: output });
        hasConflict = true;
      }
      outputMap[output] = task.id;
    }

    if (!hasConflict) {
      safe.push(task);
    }
  }

  return { parallelizable: safe, conflicts };
}

function printStatus(data) {
  const tasks = data.tasks || [];

  log('\n═══ Task Graph Status ═══\n', colors.bold + colors.blue);

  const counts = {};
  for (const task of tasks) {
    counts[task.status] = (counts[task.status] || 0) + 1;
  }

  for (const [status, count] of Object.entries(counts)) {
    const color = status === 'COMPLETED' ? colors.green :
                  status === 'FAILED' || status === 'BLOCKED' ? colors.red :
                  status === 'IN_PROGRESS' ? colors.yellow : colors.reset;
    log(`  ${status}: ${count}`, color);
  }

  log(`\n  Total: ${tasks.length}`, colors.cyan);

  const ready = getReadyTasks(tasks);
  if (ready.length > 0) {
    log(`\n  Ready for execution: ${ready.length}`, colors.green);
    for (const t of ready) {
      log(`    - ${t.id}: ${t.description}`, colors.reset);
    }
  }
}

// ─── Task Mutations ───

function completeTask(data, taskId) {
  const task = data.tasks.find(t => t.id === taskId);
  if (!task) {
    log(`Task ${taskId} not found.`, colors.red);
    process.exit(1);
  }
  task.status = 'COMPLETED';
  task.completedAt = new Date().toISOString();
  log(`Task ${taskId} marked as COMPLETED.`, colors.green);

  // Propagate: check if any dependent tasks are now ready
  const newlyReady = getReadyTasks(data.tasks).filter(t => t.status === 'PENDING');
  for (const t of newlyReady) {
    t.status = 'READY';
    log(`  → Task ${t.id} is now READY.`, colors.cyan);
  }

  saveTasks(data);
}

function failTask(data, taskId, reason) {
  const task = data.tasks.find(t => t.id === taskId);
  if (!task) {
    log(`Task ${taskId} not found.`, colors.red);
    process.exit(1);
  }

  const retries = (task.retryPolicy && task.retryPolicy.currentRetries) || 0;
  const maxRetries = (task.retryPolicy && task.retryPolicy.maxRetries) || 3;

  if (retries < maxRetries) {
    task.status = 'RETRYING';
    task.retryPolicy.currentRetries = retries + 1;
    task.failureReason = reason;
    log(`Task ${taskId} FAILED (retry ${retries + 1}/${maxRetries}): ${reason}`, colors.yellow);
  } else {
    task.status = 'BLOCKED';
    task.failureReason = reason;
    log(`Task ${taskId} BLOCKED (max retries exceeded): ${reason}`, colors.red);
  }

  saveTasks(data);
}

// ─── CLI Router ───

const command = process.argv[2];
const data = loadTasks();

switch (command) {
  case 'validate':
    const valid = validate(data);
    process.exit(valid ? 0 : 1);
    break;

  case 'ready':
    const ready = getReadyTasks(data.tasks);
    log('\n═══ Ready Tasks ═══\n', colors.bold + colors.blue);
    if (ready.length === 0) {
      log('No tasks are ready for execution.', colors.yellow);
    } else {
      for (const t of ready) {
        log(`  ${t.id}: ${t.description} [${t.priority}] [${t.complexity}]`, colors.green);
      }
    }
    break;

  case 'blocked':
    const blocked = getBlockedTasks(data.tasks);
    log('\n═══ Blocked Tasks ═══\n', colors.bold + colors.red);
    if (blocked.length === 0) {
      log('No blocked tasks.', colors.green);
    } else {
      for (const t of blocked) {
        log(`  ${t.id}: ${t.description} — ${t.failureReason || 'No reason'}`, colors.red);
      }
    }
    break;

  case 'parallel':
    const { parallelizable, conflicts } = getParallelizableTasks(data.tasks);
    log('\n═══ Parallelizable Tasks ═══\n', colors.bold + colors.blue);
    if (parallelizable.length === 0) {
      log('No parallelizable tasks found.', colors.yellow);
    } else {
      for (const t of parallelizable) {
        log(`  ${t.id}: ${t.description}`, colors.green);
      }
    }
    if (conflicts.length > 0) {
      log('\nConflicts detected:', colors.red);
      for (const c of conflicts) {
        log(`  ${c.task1} ↔ ${c.task2} (shared: ${c.file})`, colors.red);
      }
    }
    break;

  case 'status':
    printStatus(data);
    break;

  case 'complete':
    const completeId = process.argv[3];
    if (!completeId) {
      log('Usage: node task-graph.js complete <taskId>', colors.red);
      process.exit(1);
    }
    completeTask(data, completeId);
    break;

  case 'fail':
    const failId = process.argv[3];
    const failReason = process.argv[4] || 'Unknown failure';
    if (!failId) {
      log('Usage: node task-graph.js fail <taskId> <reason>', colors.red);
      process.exit(1);
    }
    failTask(data, failId, failReason);
    break;

  default:
    console.log(`
Usage: node task-graph.js <command> [options]

Commands:
  validate              Validate task graph integrity (unique IDs, no cycles, valid deps)
  ready                 List tasks ready for execution (all deps satisfied)
  blocked               List blocked tasks
  parallel              List tasks that can safely run in parallel
  status                Print task graph summary
  complete <taskId>     Mark a task as completed and propagate readiness
  fail <taskId> <reason>  Mark a task as failed (with auto-retry logic)
`);
}
