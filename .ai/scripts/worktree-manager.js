/**
 * Worktree Lifecycle Automation Helper (V2 Tier-B)
 * 
 * Integrates Git worktrees with task DAG execution.
 * Enforces safety: prevents deletion of uncommitted or unmerged work.
 * 
 * Usage:
 *   node .ai/scripts/worktree-manager.js create <taskId> [branch]
 *   node .ai/scripts/worktree-manager.js status
 *   node .ai/scripts/worktree-manager.js validate
 *   node .ai/scripts/worktree-manager.js reconcile <taskId>
 *   node .ai/scripts/worktree-manager.js cleanup [taskId]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const workspaceRoot = path.join(__dirname, '../..');
const worktreesBaseDir = path.join(workspaceRoot, '.worktrees');
const tasksPath = path.join(workspaceRoot, '.ai/state/tasks.json');

function runGit(cmd, cwd = workspaceRoot) {
  try {
    return execSync(`git ${cmd}`, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    throw new Error(err.stderr ? err.stderr.trim() : err.message);
  }
}

function loadTasks() {
  if (!fs.existsSync(tasksPath)) return { tasks: [] };
  try {
    return JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  } catch (e) {
    return { tasks: [] };
  }
}

function saveTasks(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(tasksPath, JSON.stringify(data, null, 2));
}

// ─── Worktree Creation ───
function createWorktree(taskId, customBranch = null) {
  if (!taskId) {
    log('Usage: node worktree-manager.js create <taskId> [branch]', colors.red);
    process.exit(1);
  }

  const tasksData = loadTasks();
  const task = (tasksData.tasks || []).find(t => t.id === taskId);
  if (!task) {
    log(`Task "${taskId}" not found in tasks.json`, colors.red);
    process.exit(1);
  }

  const branchName = customBranch || `feat/${taskId.toLowerCase()}`;
  const targetDir = path.join(worktreesBaseDir, taskId);

  if (!fs.existsSync(worktreesBaseDir)) {
    fs.mkdirSync(worktreesBaseDir, { recursive: true });
  }

  if (fs.existsSync(targetDir)) {
    log(`Worktree directory already exists at: ${path.relative(workspaceRoot, targetDir)}`, colors.yellow);
    return targetDir;
  }

  log(`Creating worktree for task ${taskId} on branch "${branchName}"...`, colors.bold + colors.blue);

  // Check if branch exists
  let branchExists = false;
  try {
    runGit(`rev-parse --verify ${branchName}`);
    branchExists = true;
  } catch (e) {
    branchExists = false;
  }

  const branchArg = branchExists ? branchName : `-b ${branchName}`;
  const relPath = path.relative(workspaceRoot, targetDir).replace(/\\/g, '/');

  try {
    runGit(`worktree add ${branchArg} "${relPath}"`);
    log(`✔ Worktree successfully created at: ${relPath}`, colors.green);
  } catch (err) {
    log(`✘ Failed to create git worktree: ${err.message}`, colors.red);
    process.exit(1);
  }

  // Update task state in tasks.json
  task.worktree = {
    path: relPath,
    branch: branchName,
    createdAt: new Date().toISOString(),
    status: 'ATTACHED'
  };
  saveTasks(tasksData);

  return targetDir;
}

// ─── Worktree Status ───
function getWorktreeStatus() {
  log('\n═══ Worktree Status ═══\n', colors.bold + colors.blue);

  let rawList = '';
  try {
    rawList = runGit('worktree list --porcelain');
  } catch (err) {
    log(`Error querying git worktree: ${err.message}`, colors.red);
    return [];
  }

  const tasksData = loadTasks();
  const results = [];
  const entries = rawList.split(/\n\s*\n/).filter(Boolean);

  entries.forEach(entry => {
    const lines = entry.split('\n');
    let wtPath = '';
    let commit = '';
    let branchInfo = 'detached';

    lines.forEach(line => {
      if (line.startsWith('worktree ')) wtPath = line.substring(9).trim();
      else if (line.startsWith('HEAD ')) commit = line.substring(5).trim();
      else if (line.startsWith('branch ')) branchInfo = line.substring(7).trim().replace('refs/heads/', '');
    });

    if (!wtPath) return;

    const normWt = path.resolve(wtPath).replace(/\\/g, '/').toLowerCase();
    const normRoot = path.resolve(workspaceRoot).replace(/\\/g, '/').toLowerCase();
    const isMain = normWt === normRoot;
    const relDir = path.relative(workspaceRoot, wtPath).replace(/\\/g, '/');

    let dirty = false;
    let uncommittedCount = 0;
    if (fs.existsSync(wtPath)) {
      try {
        const porcelain = runGit('status --porcelain', wtPath);
        if (porcelain.length > 0) {
          dirty = true;
          uncommittedCount = porcelain.split('\n').filter(Boolean).length;
        }
      } catch (e) {}
    }

    const matchedTask = (tasksData.tasks || []).find(t => t.worktree && t.worktree.path === relDir);

    results.push({
      path: wtPath,
      relDir: relDir || '.',
      branch: branchInfo,
      commit,
      isMain,
      dirty,
      uncommittedCount,
      taskId: matchedTask ? matchedTask.id : null
    });
  });

  results.forEach(w => {
    if (w.isMain) {
      log(`[MAIN WORKSPACE] ${w.path} (${w.branch})`, colors.bold + colors.cyan);
    } else {
      const taskLabel = w.taskId ? `[Task: ${w.taskId}]` : '[Unmanaged]';
      const dirtyLabel = w.dirty ? `⚠️  ${w.uncommittedCount} uncommitted changes` : '✔ Clean';
      log(`[WORKTREE] ${w.relDir} ${taskLabel} (${w.branch}) — ${dirtyLabel}`, w.dirty ? colors.yellow : colors.green);
    }
  });

  return results;
}

// ─── Worktree Reconciliation ───
function reconcileWorktree(taskId) {
  if (!taskId) {
    log('Usage: node worktree-manager.js reconcile <taskId>', colors.red);
    process.exit(1);
  }

  const tasksData = loadTasks();
  const task = (tasksData.tasks || []).find(t => t.id === taskId);
  if (!task || !task.worktree) {
    log(`Task ${taskId} has no associated worktree!`, colors.red);
    process.exit(1);
  }

  const wtDir = path.join(workspaceRoot, task.worktree.path);
  const branchName = task.worktree.branch;

  log(`Reconciling worktree for task ${taskId} (Branch: ${branchName})...`, colors.bold + colors.blue);

  // 1. Check for uncommitted work inside worktree
  const status = runGit('status --porcelain', wtDir);
  if (status.length > 0) {
    log(`✘ Cannot reconcile: worktree has uncommitted changes! Please commit first.`, colors.red);
    process.exit(1);
  }

  // 2. Merge branch into current workspace
  try {
    runGit(`merge --no-ff ${branchName} -m "Merge worktree ${branchName} for task ${taskId}"`);
    log(`✔ Successfully merged branch ${branchName} into current branch`, colors.green);
    task.worktree.status = 'RECONCILED';
    task.worktree.reconciledAt = new Date().toISOString();
    saveTasks(tasksData);
  } catch (err) {
    log(`✘ Merge conflict or failure while reconciling: ${err.message}`, colors.red);
    task.worktree.status = 'CONFLICT';
    saveTasks(tasksData);
    process.exit(1);
  }
}

// ─── Safe Cleanup ───
function cleanupWorktree(targetTaskId = null) {
  log('\n═══ Worktree Cleanup ═══\n', colors.bold + colors.blue);
  const tasksData = loadTasks();
  const allWorktrees = getWorktreeStatus().filter(w => !w.isMain);

  if (allWorktrees.length === 0) {
    log('No auxiliary worktrees to clean up.', colors.green);
    return;
  }

  const toProcess = targetTaskId ? allWorktrees.filter(w => w.taskId === targetTaskId) : allWorktrees;

  toProcess.forEach(wt => {
    log(`Evaluating cleanup for ${wt.relDir}...`, colors.cyan);

    // Rule 1: NEVER delete with uncommitted changes
    if (wt.dirty) {
      log(`✘ REFUSING REMOVAL: Worktree "${wt.relDir}" has ${wt.uncommittedCount} uncommitted change(s).`, colors.red);
      return;
    }

    // Rule 2: Check if branch is merged
    const branchClean = wt.branch.replace(/[\[\]]/g, '').trim();
    let isMerged = false;
    try {
      const mergedBranches = runGit('branch --merged');
      isMerged = mergedBranches.includes(branchClean);
    } catch (e) {
      isMerged = false;
    }

    if (!isMerged) {
      log(`✘ REFUSING REMOVAL: Branch "${branchClean}" is not merged into current HEAD.`, colors.red);
      return;
    }

    // Safe to remove
    try {
      runGit(`worktree remove "${wt.relDir}"`);
      log(`✔ Safely removed worktree: ${wt.relDir}`, colors.green);

      if (wt.taskId) {
        const task = (tasksData.tasks || []).find(t => t.id === wt.taskId);
        if (task && task.worktree) {
          task.worktree.status = 'REMOVED';
          task.worktree.removedAt = new Date().toISOString();
        }
      }
    } catch (err) {
      log(`✘ Failed to remove worktree: ${err.message}`, colors.red);
    }
  });

  saveTasks(tasksData);
}

// ─── Validation ───
function validateWorktrees() {
  log('\n═══ Worktree Validation ═══\n', colors.bold + colors.blue);
  const statuses = getWorktreeStatus();
  let errors = 0;

  statuses.filter(s => !s.isMain).forEach(wt => {
    if (!fs.existsSync(wt.path)) {
      log(`✘ Worktree registered in Git but missing from filesystem: ${wt.path}`, colors.red);
      errors++;
    }
  });

  if (errors === 0) {
    log(`✔ All active worktrees are healthy and verified (${statuses.length} total).`, colors.green);
    return true;
  } else {
    log(`✘ Worktree validation failed with ${errors} error(s).`, colors.red);
    return false;
  }
}

// ─── CLI Router ───
if (require.main === module) {
  const cmd = process.argv[2];

  switch (cmd) {
    case 'create':
      createWorktree(process.argv[3], process.argv[4]);
      break;
    case 'status':
      getWorktreeStatus();
      break;
    case 'validate':
      const ok = validateWorktrees();
      process.exit(ok ? 0 : 1);
      break;
    case 'reconcile':
      reconcileWorktree(process.argv[3]);
      break;
    case 'cleanup':
      cleanupWorktree(process.argv[3]);
      break;
    default:
      console.log(`
Usage: node worktree-manager.js <command> [options]

Commands:
  create <taskId> [branch]   Create an isolated git worktree linked to a task ID
  status                     List all active worktrees, task associations, and clean/dirty state
  validate                   Verify worktree registry and filesystem integrity
  reconcile <taskId>         Safely merge worktree branch into current workspace
  cleanup [taskId]           Safely remove clean and merged worktrees (refuses uncommitted/unmerged)
`);
  }
}

module.exports = {
  createWorktree,
  getWorktreeStatus,
  reconcileWorktree,
  cleanupWorktree,
  validateWorktrees
};
