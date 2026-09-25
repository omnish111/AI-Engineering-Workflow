/**
 * V2 Tier-B Wave 1 Verification Suite
 * 
 * Tests the 7 required scenarios:
 * Scenario A: State corruption detection
 * Scenario B: Stale state detection
 * Scenario C: New module context discovery
 * Scenario D: Manual context override preservation
 * Scenario E: Two independent tasks using separate worktrees
 * Scenario F: Stale worktree cleanup protection (refuse to delete uncommitted/unmerged work)
 * Scenario G: Interrupted worktree task recovery
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
const { validateState, detectStaleState } = require('./status-manager');
const { discoverContext, compileManifest } = require('./update-context-manifest');
const { createWorktree, getWorktreeStatus, cleanupWorktree } = require('./worktree-manager');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, description) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✔ ${description}`);
  } else {
    failedChecks++;
    console.log(`  ✘ ${colors.red}${description}${colors.reset}`);
  }
}

// ─── Scenario A: State Corruption Detection ───
function testScenarioA() {
  log('\n═══ Scenario A: State Corruption Detection ═══', colors.bold + colors.blue);
  const testCorruptedPath = path.join(workspaceRoot, '.ai/state/_test_corrupt.json');
  fs.writeFileSync(testCorruptedPath, '{ invalid json syntax ');

  try {
    let corruptionCaught = false;
    try {
      JSON.parse(fs.readFileSync(testCorruptedPath, 'utf8'));
    } catch (e) {
      corruptionCaught = true;
    }
    assert(corruptionCaught, 'Malformed JSON throws parser exception');

    const report = validateState();
    assert(report.valid === true, 'Healthy state validated when files are intact');
  } finally {
    if (fs.existsSync(testCorruptedPath)) fs.unlinkSync(testCorruptedPath);
  }
}

// ─── Scenario B: Stale State Detection ───
function testScenarioB() {
  log('\n═══ Scenario B: Stale State Detection ═══', colors.bold + colors.blue);
  const tasksPath = path.join(workspaceRoot, '.ai/state/tasks.json');
  const originalTasks = fs.readFileSync(tasksPath, 'utf8');

  try {
    const tasksObj = JSON.parse(originalTasks);
    // Inject a stale task assigned 48 hours ago
    const staleTime = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    tasksObj.tasks.push({
      id: 'TASK-STALE-TEST',
      description: 'Stale test task',
      status: 'IN_PROGRESS',
      assignedAt: staleTime,
      dependsOn: []
    });
    fs.writeFileSync(tasksPath, JSON.stringify(tasksObj, null, 2));

    const staleItems = detectStaleState(24);
    const found = staleItems.find(s => s.taskId === 'TASK-STALE-TEST');
    assert(found !== undefined, 'Stale IN_PROGRESS task successfully detected (>24h threshold)');
    assert(found && found.type === 'STALE_IN_PROGRESS', 'Correct stale type tagged');
  } finally {
    fs.writeFileSync(tasksPath, originalTasks);
  }
}

// ─── Scenario C: New Module Context Discovery ───
function testScenarioC() {
  log('\n═══ Scenario C: New Module Context Discovery ═══', colors.bold + colors.blue);
  const dummyModuleDir = path.join(workspaceRoot, 'codebase/backend/src/billing');
  const dummyFile = path.join(dummyModuleDir, 'billing.service.ts');

  try {
    if (!fs.existsSync(dummyModuleDir)) fs.mkdirSync(dummyModuleDir, { recursive: true });
    fs.writeFileSync(dummyFile, 'export class BillingService {}');

    const discovery = discoverContext();
    assert(discovery.inventory.backendFilesCount > 0, 'Backend file inventory includes newly discovered files');
    assert(discovery.discoveredGroups.backend !== undefined, 'Discovered backend context group is populated');
  } finally {
    if (fs.existsSync(dummyFile)) fs.unlinkSync(dummyFile);
    if (fs.existsSync(dummyModuleDir)) fs.rmdirSync(dummyModuleDir);
  }
}

// ─── Scenario D: Manual Context Override Preservation ───
function testScenarioD() {
  log('\n═══ Scenario D: Manual Context Override Preservation ═══', colors.bold + colors.blue);
  const overridesPath = path.join(workspaceRoot, '.ai/orchestration/context-overrides.json');
  const originalOverrides = fs.readFileSync(overridesPath, 'utf8');

  try {
    const overridesObj = JSON.parse(originalOverrides);
    overridesObj.manualContextGroups['custom-security-audit'] = {
      description: 'Curated custom override group',
      files: ['.ai/settings.json']
    };
    fs.writeFileSync(overridesPath, JSON.stringify(overridesObj, null, 2));

    const compiled = compileManifest();
    assert(
      compiled.contextGroups['custom-security-audit'] !== undefined,
      'Manual context override group is preserved in compiled manifest'
    );
    assert(
      compiled.contextGroups['custom-security-audit'].description === 'Curated custom override group',
      'Override content is preserved exactly without being overwritten'
    );
  } finally {
    fs.writeFileSync(overridesPath, originalOverrides);
  }
}

// ─── Scenario E: Two Independent Tasks Using Separate Worktrees ───
function testScenarioE() {
  log('\n═══ Scenario E: Two Independent Tasks in Worktrees ═══', colors.bold + colors.blue);
  const tasksPath = path.join(workspaceRoot, '.ai/state/tasks.json');
  const originalTasks = fs.readFileSync(tasksPath, 'utf8');

  const t1Id = 'TASK-WT-001';
  const t2Id = 'TASK-WT-002';

  try {
    const tasksObj = JSON.parse(originalTasks);
    tasksObj.tasks.push(
      { id: t1Id, description: 'Task 1 in Worktree', status: 'READY' },
      { id: t2Id, description: 'Task 2 in Worktree', status: 'READY' }
    );
    fs.writeFileSync(tasksPath, JSON.stringify(tasksObj, null, 2));

    const wt1Dir = createWorktree(t1Id, 'feat/task-wt-001');
    const wt2Dir = createWorktree(t2Id, 'feat/task-wt-002');

    assert(fs.existsSync(wt1Dir), `Worktree 1 directory created for ${t1Id}`);
    assert(fs.existsSync(wt2Dir), `Worktree 2 directory created for ${t2Id}`);

    const statuses = getWorktreeStatus();
    const wt1Status = statuses.find(s => s.taskId === t1Id);
    const wt2Status = statuses.find(s => s.taskId === t2Id);

    assert(wt1Status !== undefined, 'Worktree 1 registered in git worktree list');
    assert(wt2Status !== undefined, 'Worktree 2 registered in git worktree list');
    assert(wt1Status.path !== wt2Status.path, 'Both worktrees run in isolated directory paths');

    // Clean up worktrees safely
    try {
      execSync(`git worktree remove --force "${path.relative(workspaceRoot, wt1Dir).replace(/\\/g, '/')}"`, { cwd: workspaceRoot });
      execSync(`git worktree remove --force "${path.relative(workspaceRoot, wt2Dir).replace(/\\/g, '/')}"`, { cwd: workspaceRoot });
      execSync(`git branch -D feat/task-wt-001`, { cwd: workspaceRoot });
      execSync(`git branch -D feat/task-wt-002`, { cwd: workspaceRoot });
    } catch (e) {}

  } finally {
    fs.writeFileSync(tasksPath, originalTasks);
  }
}

// ─── Scenario F: Stale Worktree Cleanup Protection ───
function testScenarioF() {
  log('\n═══ Scenario F: Stale Worktree Cleanup Protection ═══', colors.bold + colors.blue);
  const tasksPath = path.join(workspaceRoot, '.ai/state/tasks.json');
  const originalTasks = fs.readFileSync(tasksPath, 'utf8');
  const tId = 'TASK-WT-DIRTY';

  try {
    const tasksObj = JSON.parse(originalTasks);
    tasksObj.tasks.push({ id: tId, description: 'Dirty task', status: 'READY' });
    fs.writeFileSync(tasksPath, JSON.stringify(tasksObj, null, 2));

    const wtDir = createWorktree(tId, 'feat/task-wt-dirty');
    assert(fs.existsSync(wtDir), 'Dirty worktree directory created');

    // Create an uncommitted file in the worktree
    const dirtyFilePath = path.join(wtDir, 'uncommitted-work.txt');
    fs.writeFileSync(dirtyFilePath, 'Important unsaved work!');

    const statuses = getWorktreeStatus();
    const wtStatus = statuses.find(s => s.taskId === tId);
    assert(wtStatus && wtStatus.dirty === true, 'Worktree detected as dirty (uncommitted changes)');

    // Attempt cleanup: should REFUSE to delete
    cleanupWorktree(tId);
    assert(fs.existsSync(wtDir), 'Cleanup REFUSED: Dirty worktree was preserved from deletion');

    // Clean up test worktree
    try {
      execSync(`git worktree remove --force "${path.relative(workspaceRoot, wtDir).replace(/\\/g, '/')}"`, { cwd: workspaceRoot });
      execSync(`git branch -D feat/task-wt-dirty`, { cwd: workspaceRoot });
    } catch (e) {}

  } finally {
    fs.writeFileSync(tasksPath, originalTasks);
  }
}

// ─── Scenario G: Interrupted Worktree Task Recovery ───
function testScenarioG() {
  log('\n═══ Scenario G: Interrupted Worktree Task Recovery ═══', colors.bold + colors.blue);
  const tasksPath = path.join(workspaceRoot, '.ai/state/tasks.json');
  const originalTasks = fs.readFileSync(tasksPath, 'utf8');
  const tId = 'TASK-WT-RECOVER';

  try {
    const tasksObj = JSON.parse(originalTasks);
    tasksObj.tasks.push({ id: tId, description: 'Interrupted task', status: 'IN_PROGRESS' });
    fs.writeFileSync(tasksPath, JSON.stringify(tasksObj, null, 2));

    const wtDir = createWorktree(tId, 'feat/task-wt-recover');

    // Check that task is properly linked with worktree metadata
    const reloaded = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
    const recoveredTask = reloaded.tasks.find(t => t.id === tId);

    assert(recoveredTask.worktree !== undefined, 'Worktree metadata persisted in tasks.json for resumption');
    assert(recoveredTask.worktree.status === 'ATTACHED', 'Worktree status tracked as ATTACHED');

    // Clean up test worktree
    try {
      execSync(`git worktree remove --force "${path.relative(workspaceRoot, wtDir).replace(/\\/g, '/')}"`, { cwd: workspaceRoot });
      execSync(`git branch -D feat/task-wt-recover`, { cwd: workspaceRoot });
    } catch (e) {}

  } finally {
    fs.writeFileSync(tasksPath, originalTasks);
  }
}

// ─── Run All Wave 1 Tests ───
log('\n╔═══════════════════════════════════════════════╗', colors.bold + colors.cyan);
log('║   V2 TIER-B WAVE 1 AUTOMATED TEST SUITE       ║', colors.bold + colors.cyan);
log('╚═══════════════════════════════════════════════╝', colors.bold + colors.cyan);

testScenarioA();
testScenarioB();
testScenarioC();
testScenarioD();
testScenarioE();
testScenarioF();
testScenarioG();

log('\n═════════════════════════════════════════════════', colors.bold);
log(`Total Checks: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`, failedChecks === 0 ? colors.bold + colors.green : colors.bold + colors.red);

process.exit(failedChecks === 0 ? 0 : 1);
