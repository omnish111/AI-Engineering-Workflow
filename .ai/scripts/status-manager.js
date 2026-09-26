/**
 * Enhanced State & Status Manager (V2 Tier-B)
 * 
 * Single authoritative coordinator for .ai/state/:
 * - Schema validation
 * - Deterministic state machine transitions
 * - Synchronization across project, tasks, agents, decisions, blockers
 * - Stale state and corruption detection
 * - Markdown projections and legacy mirrors
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

const stateDir = path.join(__dirname, '../state');
const projectPath = path.join(stateDir, 'project.json');
const tasksPath = path.join(stateDir, 'tasks.json');
const agentsPath = path.join(stateDir, 'agents.json');
const decisionsPath = path.join(stateDir, 'decisions.json');
const blockersPath = path.join(stateDir, 'blockers.json');
const eventsPath = path.join(stateDir, 'events.jsonl');
const legacyStatePath = path.join(__dirname, '../memory/state.json');

const { writeJsonAtomic, appendEvent } = require('./state-io');

// Ensure parent directories exist
[stateDir, path.dirname(legacyStatePath)].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Deterministic State Machine Rules ───
const VALID_TASK_TRANSITIONS = {
  PENDING: ['READY'],
  READY: ['IN_PROGRESS'],
  IN_PROGRESS: ['VERIFYING', 'FAILED'],
  VERIFYING: ['COMPLETED', 'FAILED'],
  COMPLETED: [], // Terminal
  FAILED: ['RETRYING', 'BLOCKED', 'HUMAN_REQUIRED'],
  RETRYING: ['IN_PROGRESS'],
  BLOCKED: ['READY', 'HUMAN_REQUIRED'],
  HUMAN_REQUIRED: ['READY', 'BLOCKED']
};

const VALID_PROJECT_STATUSES = [
  'AWAITING_PRD',
  'PLANNING',
  'IN_PROGRESS',
  'BLOCKED',
  'FAILED',
  'COMPLETED',
  'DEPLOYED'
];

// ─── Safe Loaders with Corruption Detection ───
function loadJsonFile(filePath, defaultFactory) {
  if (!fs.existsSync(filePath)) {
    return { data: defaultFactory(), isFresh: true, error: null };
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    return { data, isFresh: false, error: null };
  } catch (err) {
    return { data: null, isFresh: false, error: `JSON parse error in ${path.basename(filePath)}: ${err.message}` };
  }
}

function loadAllState() {
  const project = loadJsonFile(projectPath, () => ({
    version: '2.0',
    name: 'SaaS AI Factory',
    status: 'AWAITING_PRD',
    currentPhase: null,
    totalPhases: 0,
    completedPhases: 0,
    activeBlockers: 0,
    createdAt: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    architectureVersion: '2.0-tier-b',
    stateVersion: 1,
    statusHistory: [],
    validStatuses: VALID_PROJECT_STATUSES
  }));

  const tasks = loadJsonFile(tasksPath, () => ({
    version: '2.0',
    description: 'Task dependency graph (DAG)',
    tasks: [],
    phases: [],
    validTransitions: VALID_TASK_TRANSITIONS
  }));

  const agents = loadJsonFile(agentsPath, () => ({
    version: '2.0',
    description: 'Agent role status tracking',
    activeRoles: [],
    roleHistory: []
  }));

  const decisions = loadJsonFile(decisionsPath, () => ({
    version: '2.0',
    description: 'Machine-readable decision log',
    decisions: []
  }));

  const blockers = loadJsonFile(blockersPath, () => ({
    version: '2.0',
    description: 'Machine-readable blocker tracking',
    blockers: []
  }));

  return { project, tasks, agents, decisions, blockers };
}

// ─── Validation & Consistency Engine ───
function validateState() {
  const state = loadAllState();
  const errors = [];
  const warnings = [];

  // 1. Check file corruption
  Object.entries(state).forEach(([key, res]) => {
    if (res.error) {
      errors.push(`[CORRUPTION] ${res.error}`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  const projData = state.project.data;
  const tasksData = state.tasks.data;
  const agentsData = state.agents.data;
  const blockersData = state.blockers.data;
  const decisionsData = state.decisions.data;

  // 2. Validate Project Schema
  if (!projData.name || typeof projData.name !== 'string') errors.push('project.json: missing or invalid "name"');
  if (!VALID_PROJECT_STATUSES.includes(projData.status)) {
    errors.push(`project.json: invalid status "${projData.status}". Allowed: ${VALID_PROJECT_STATUSES.join(', ')}`);
  }

  // 3. Validate Tasks Schema & DAG
  const taskIds = new Set();
  const tasks = tasksData.tasks || [];
  tasks.forEach(t => {
    if (!t.id) errors.push('tasks.json: task missing "id"');
    if (!t.description) errors.push(`tasks.json [${t.id || 'unknown'}]: missing "description"`);
    if (!t.status) errors.push(`tasks.json [${t.id || 'unknown'}]: missing "status"`);
    else if (!VALID_TASK_TRANSITIONS[t.status]) {
      errors.push(`tasks.json [${t.id}]: unknown task status "${t.status}"`);
    }

    if (t.id) {
      if (taskIds.has(t.id)) errors.push(`tasks.json: duplicate task ID "${t.id}"`);
      taskIds.add(t.id);
    }
  });

  // Check unresolved dependency references
  tasks.forEach(t => {
    (t.dependsOn || []).forEach(dep => {
      if (!taskIds.has(dep)) {
        errors.push(`tasks.json [${t.id}]: depends on unknown task ID "${dep}"`);
      }
    });
  });

  // 4. Validate Agent Roles
  const activeRoles = new Set(agentsData.activeRoles || []);
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'VERIFYING');
  inProgressTasks.forEach(t => {
    const expectedRole = t.role || 'implementer';
    if (activeRoles.size > 0 && !activeRoles.has(expectedRole)) {
      warnings.push(`agents.json: task ${t.id} is ${t.status} with role "${expectedRole}" but role is not listed in activeRoles`);
    }
  });

  // 5. Validate Blockers & Alignment
  const activeBlockers = (blockersData.blockers || []).filter(b => b.status === 'ACTIVE');
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED');
  if (projData.activeBlockers !== activeBlockers.length && projData.activeBlockers !== blockedTasks.length) {
    warnings.push(`project.json: activeBlockers (${projData.activeBlockers}) does not match active blockers count (${activeBlockers.length}) or blocked tasks count (${blockedTasks.length})`);
  }

  // 6. Validate Decisions Schema
  (decisionsData.decisions || []).forEach(d => {
    if (!d.id || !d.topic || !d.decision) {
      errors.push(`decisions.json: decision entry missing id, topic, or decision`);
    }
    if (typeof d.confidence === 'number' && (d.confidence < 0 || d.confidence > 1)) {
      errors.push(`decisions.json [${d.id}]: confidence must be between 0.0 and 1.0`);
    }
  });

  // 7. Check Events Log
  if (fs.existsSync(eventsPath)) {
    const lines = fs.readFileSync(eventsPath, 'utf8').trim().split('\n').filter(Boolean);
    lines.forEach((line, idx) => {
      try {
        JSON.parse(line);
      } catch (err) {
        errors.push(`events.jsonl: Line ${idx + 1} contains invalid JSON`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ─── Stale State Detection ───
function detectStaleState(maxStaleHours = 24) {
  const state = loadAllState();
  const staleItems = [];

  if (state.tasks.error || !state.tasks.data) return staleItems;
  const tasks = state.tasks.data.tasks || [];
  const now = Date.now();
  const staleMs = maxStaleHours * 60 * 60 * 1000;

  tasks.forEach(t => {
    // 1. In-progress tasks not updated within timeout
    if (t.status === 'IN_PROGRESS' || t.status === 'VERIFYING') {
      const assignedTime = t.assignedAt ? new Date(t.assignedAt).getTime() : 0;
      if (assignedTime && (now - assignedTime > staleMs)) {
        staleItems.push({
          taskId: t.id,
          type: 'STALE_IN_PROGRESS',
          description: `Task ${t.id} has been ${t.status} for > ${maxStaleHours} hours without completion`
        });
      }
    }

    // 2. Orphaned tasks (depends on failed or permanently blocked tasks)
    const deps = t.dependsOn || [];
    deps.forEach(depId => {
      const parent = tasks.find(pt => pt.id === depId);
      if (parent && (parent.status === 'FAILED' || parent.status === 'BLOCKED')) {
        staleItems.push({
          taskId: t.id,
          type: 'ORPHANED_DEPENDENCY',
          description: `Task ${t.id} is blocked by failed/blocked dependency ${depId}`
        });
      }
    });
  });

  return staleItems;
}

// ─── Deterministic Transition Enforcer ───
function validateTransition(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return true;
  const allowed = VALID_TASK_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

// ─── Markdown Projections & Legacy Sync ───
function syncMarkdowns() {
  log('Syncing state across project, tasks, markdown logs, and legacy projections...', colors.bold + colors.blue);
  
  const { project, tasks, agents, decisions, blockers } = loadAllState();
  if (project.error || tasks.error) {
    log('Cannot sync: state files are corrupted!', colors.red);
    return false;
  }

  const proj = project.data;
  const taskState = tasks.data;
  const allTasks = taskState.tasks || [];
  const phases = taskState.phases || [];

  let completedTasks = 0;
  let inProgressTasks = 0;
  let failedTasks = 0;
  let blockedTasks = 0;
  let readyTasks = 0;
  let pendingTasks = 0;

  const roleStats = {};
  const completedList = [];

  allTasks.forEach(t => {
    const role = t.role || t.agent || t.type || 'implementer';
    if (!roleStats[role]) {
      roleStats[role] = { assigned: 0, completed: 0, inProgress: 0, failed: 0, blocked: 0 };
    }
    roleStats[role].assigned++;

    if (t.status === 'COMPLETED') {
      completedTasks++;
      roleStats[role].completed++;
      completedList.push(t);
    } else if (t.status === 'IN_PROGRESS' || t.status === 'RETRYING') {
      inProgressTasks++;
      roleStats[role].inProgress++;
    } else if (t.status === 'VERIFYING') {
      inProgressTasks++;
      roleStats[role].inProgress++;
    } else if (t.status === 'FAILED') {
      failedTasks++;
      roleStats[role].failed++;
    } else if (t.status === 'BLOCKED' || t.status === 'HUMAN_REQUIRED') {
      blockedTasks++;
      roleStats[role].blocked++;
    } else if (t.status === 'READY') {
      readyTasks++;
    } else {
      pendingTasks++;
    }
  });

  const phaseList = phases.length > 0 ? phases : Array.from(new Set(allTasks.map(t => t.phase).filter(Boolean))).map(p => ({
    id: p,
    name: p,
    status: 'IN_PROGRESS'
  }));

  const completedPhases = phaseList.filter(p => {
    const pTasks = allTasks.filter(t => t.phase === p.id);
    return pTasks.length > 0 && pTasks.every(t => t.status === 'COMPLETED');
  }).length;

  proj.totalPhases = phaseList.length;
  proj.completedPhases = completedPhases;
  proj.activeBlockers = blockedTasks;
  proj.lastUpdated = new Date().toISOString().split('T')[0];

  // Save updated project state atomically
  writeJsonAtomic(projectPath, proj);

  // Write Project Status Markdown
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
  const progressBars = '█'.repeat(Math.round(progressPercent / 5)) + '░'.repeat(20 - Math.round(progressPercent / 5));

  const projStatusMd = `# Project Status

> Synced deterministically by status-manager.js from \`.ai/state/\`. Do not edit manually.

---

## Current Status

| Field | Value |
|-------|-------|
| **Project** | ${proj.name} |
| **Status** | ${proj.status} |
| **Current Phase** | ${proj.currentPhase || 'None'} |
| **Total Phases** | ${proj.totalPhases} |
| **Completed Phases** | ${proj.completedPhases} |
| **Active Blockers** | ${proj.activeBlockers} |
| **Architecture** | ${proj.architectureVersion || 'v2-tier-b'} |
| **Last Updated** | ${proj.lastUpdated} |

## Metrics Summary

| Metric | Value |
|-------|-------|
| Total Tasks | ${allTasks.length} |
| Completed Tasks | ${completedTasks} (${progressPercent}%) |
| In-Progress Tasks | ${inProgressTasks} |
| Ready Tasks | ${readyTasks} |
| Blocked Tasks | ${blockedTasks} |
| Failed Tasks | ${failedTasks} |

---

*Last synchronized: ${new Date().toISOString()}*
`;
  fs.writeFileSync(path.join(__dirname, '../project-management/project-status.md'), projStatusMd);

  // Write Progress Markdown
  let progressMd = `# Progress Tracker

> Synced deterministically by status-manager.js from \`.ai/state/\`. Do not edit manually.

---

## Progress Overview

\`\`\`
Total Progress: [${progressBars}] ${progressPercent}% (${completedTasks}/${allTasks.length} tasks)
\`\`\`

## Progress by Role

| Role / Capability | Assigned | Completed | In Progress | Failed | Blocked |
|-------------------|----------|-----------|-------------|--------|---------|
${Object.entries(roleStats).map(([r, s]) => `| ${r} | ${s.assigned} | ${s.completed} | ${s.inProgress} | ${s.failed} | ${s.blocked} |`).join('\n')}
| **Total** | **${allTasks.length}** | **${completedTasks}** | **${inProgressTasks}** | **${failedTasks}** | **${blockedTasks}** |

## Task Status Details

| # | Task ID | Description | Role | Priority | Status | Depends On |
|---|---------|-------------|------|----------|--------|------------|
${allTasks.map((t, idx) => {
  let sym = '⬜';
  if (t.status === 'COMPLETED') sym = '✅';
  else if (t.status === 'READY') sym = '🟨';
  else if (t.status === 'IN_PROGRESS') sym = '🔄';
  else if (t.status === 'VERIFYING') sym = '🔍';
  else if (t.status === 'FAILED') sym = '❌';
  else if (t.status === 'BLOCKED') sym = '🚫';
  const deps = (t.dependsOn && t.dependsOn.length > 0) ? t.dependsOn.join(', ') : 'None';
  return `| ${idx + 1} | ${t.id} | ${t.description} | ${t.role || 'implementer'} | ${t.priority || 'P1'} | ${sym} ${t.status} | ${deps} |`;
}).join('\n')}
`;
  fs.writeFileSync(path.join(__dirname, '../project-management/progress.md'), progressMd);

  // Write Current Phase Markdown
  let curPhaseMd = `# Current Phase

> Synced deterministically by status-manager.js from \`.ai/state/\`. Do not edit manually.

---
`;
  if (proj.currentPhase) {
    const pTasks = allTasks.filter(t => t.phase === proj.currentPhase);
    curPhaseMd += `
## Active Phase: ${proj.currentPhase}

| Task ID | Description | Role | Priority | Status |
|---------|-------------|------|----------|--------|
${pTasks.map(t => `| ${t.id} | ${t.description} | ${t.role || 'implementer'} | ${t.priority || 'P1'} | ${t.status} |`).join('\n') || '| None | — | — | — | — |'}
`;
  } else {
    curPhaseMd += `\n## No Active Phase (Project Status: ${proj.status})\n`;
  }
  fs.writeFileSync(path.join(__dirname, '../project-management/current-phase.md'), curPhaseMd);

  // Write Completed Tasks Log
  let compMd = `# Completed Tasks

> Synced deterministically by status-manager.js from \`.ai/state/\`. Do not edit manually.

---

| Task ID | Description | Role | Completed Date | Verification Evidence |
|---------|-------------|------|----------------|-----------------------|
${completedList.map(t => `| ${t.id} | ${t.description} | ${t.role || 'implementer'} | ${t.completedAt || 'N/A'} | ${t.verificationEvidence || 'Verified'} |`).join('\n') || '| None | — | — | — | — |'}
`;
  fs.writeFileSync(path.join(__dirname, '../memory/completed-tasks.md'), compMd);

  // Write Legacy Compatibility Mirror (.ai/memory/state.json)
  const legacyProjection = {
    project: {
      name: proj.name,
      status: proj.status,
      startedAt: proj.createdAt || new Date().toISOString().split('T')[0],
      lastUpdated: proj.lastUpdated,
      totalPhases: proj.totalPhases,
      completedPhases: proj.completedPhases,
      activeBlockers: proj.activeBlockers
    },
    phases: phaseList.map(p => ({
      id: p.id,
      name: p.name || p.id,
      status: p.status || 'PENDING',
      tasks: allTasks.filter(t => t.phase === p.id).map(t => ({
        id: t.id,
        title: t.description,
        agent: t.role || 'implementer',
        priority: t.priority || 'P1',
        status: t.status,
        retries: (t.retryPolicy && t.retryPolicy.currentRetries) || 0
      }))
    })),
    timeline: (proj.statusHistory || []).map(h => ({
      event: h.status,
      date: h.timestamp ? h.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: h.note || ''
    }))
  };
  fs.writeFileSync(legacyStatePath, JSON.stringify(legacyProjection, null, 2));

  log('✔ All state projections and markdown files synchronized successfully.', colors.green);
  return true;
}

// ─── CLI Command Router ───
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
  case 'validate': {
    const report = validateState();
    log('\n═══ State Validation ═══\n', colors.bold + colors.blue);
    if (report.valid) {
      log('✔ State files are valid and consistent.', colors.green);
      if (report.warnings.length > 0) {
        log('\nWarnings:', colors.yellow);
        report.warnings.forEach(w => log(`  ! ${w}`, colors.yellow));
      }
      process.exit(0);
    } else {
      log('✘ State validation failed with errors:', colors.red);
      report.errors.forEach(e => log(`  - ${e}`, colors.red));
      if (report.warnings.length > 0) {
        log('\nWarnings:', colors.yellow);
        report.warnings.forEach(w => log(`  ! ${w}`, colors.yellow));
      }
      process.exit(1);
    }
    break;
  }

  case 'check-stale': {
    const hours = parseInt(process.argv[3], 10) || 24;
    const stale = detectStaleState(hours);
    log(`\n═══ Stale State Check (Threshold: ${hours}h) ═══\n`, colors.bold + colors.blue);
    if (stale.length === 0) {
      log('✔ No stale or orphaned tasks detected.', colors.green);
      process.exit(0);
    } else {
      log(`Found ${stale.length} stale/orphaned item(s):`, colors.yellow);
      stale.forEach(s => log(`  [${s.type}] ${s.description}`, colors.yellow));
      process.exit(0);
    }
    break;
  }

  case 'health': {
    log('\n═══ Full Factory State Diagnostic ═══\n', colors.bold + colors.blue);
    const validation = validateState();
    const stale = detectStaleState(24);

    let isHealthy = validation.valid && stale.length === 0;
    log(`Status Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`, validation.valid ? colors.green : colors.red);
    log(`Stale State:       ${stale.length === 0 ? 'CLEAN' : `${stale.length} items detected`}`, stale.length === 0 ? colors.green : colors.yellow);

    if (validation.errors.length > 0) {
      log('\nErrors:', colors.red);
      validation.errors.forEach(e => log(`  ✘ ${e}`, colors.red));
    }
    if (stale.length > 0) {
      log('\nStale Items:', colors.yellow);
      stale.forEach(s => log(`  ! [${s.type}] ${s.description}`, colors.yellow));
    }

    process.exit(isHealthy ? 0 : 1);
    break;
  }

  case 'sync': {
    const ok = syncMarkdowns();
    process.exit(ok ? 0 : 1);
    break;
  }

  case 'init': {
    const name = process.argv[3] || 'SaaS AI Factory';
    const state = loadAllState();
    state.project.data.name = name;
    state.project.data.status = 'AWAITING_PRD';
    state.tasks.data.tasks = [];
    state.tasks.data.phases = [];
    writeJsonAtomic(projectPath, state.project.data);
    writeJsonAtomic(tasksPath, state.tasks.data);
    syncMarkdowns();
    log(`Initialized state database for "${name}"`, colors.green);
    break;
  }

  case 'update-task-status': {
    const taskId = process.argv[3];
    const newStatus = process.argv[4];
    if (!taskId || !newStatus) {
      log('Usage: node status-manager.js update-task-status <taskId> <newStatus>', colors.red);
      process.exit(1);
    }

    const { tasks } = loadAllState();
    if (tasks.error) {
      log(tasks.error, colors.red);
      process.exit(1);
    }
    const task = (tasks.data.tasks || []).find(t => t.id === taskId);
    if (!task) {
      log(`Task "${taskId}" not found.`, colors.red);
      process.exit(1);
    }

    if (!validateTransition(task.status, newStatus)) {
      log(`✘ Invalid state transition: ${task.status} → ${newStatus}`, colors.red);
      log(`Allowed transitions from ${task.status}: ${(VALID_TASK_TRANSITIONS[task.status] || []).join(', ') || 'None'}`, colors.yellow);
      process.exit(1);
    }

    task.status = newStatus;
    if (newStatus === 'COMPLETED') task.completedAt = new Date().toISOString();
    writeJsonAtomic(tasksPath, tasks.data);
    log(`Task ${taskId} status transitioned: ${task.status} → ${newStatus}`, colors.green);
    syncMarkdowns();
    break;
  }

  default: {
    console.log(`
Usage: node status-manager.js <command> [options]

Commands:
  validate                          Validate schema, state machine integrity & file syntax
  check-stale [hours]               Detect stale in-progress or orphaned tasks (default: 24h)
  health                            Run complete factory diagnostic
  sync                              Synchronize state database to Markdown logs & legacy projections
  init <name>                       Initialize state database with project name
  update-task-status <id> <status>  Transition a task status adhering to deterministic state machine
`);
  }
}
}

module.exports = {
  validateState,
  detectStaleState,
  validateTransition,
  syncMarkdowns,
  VALID_TASK_TRANSITIONS,
  VALID_PROJECT_STATUSES
};
