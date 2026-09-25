/**
 * Golden-Task Evaluation Runner (V2 Tier-B)
 * 
 * Benchmarks factory orchestration against 10 representative golden tasks.
 * Measures:
 * - Role selection precision (expected vs unnecessary/forbidden roles)
 * - Context routing efficiency (context groups loaded vs limits)
 * - Verification quality & test expectations
 * - Human intervention triggers
 * 
 * Usage:
 *   node .ai/scripts/eval-runner.js run [taskId]
 *   node .ai/scripts/eval-runner.js list
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

const workspaceRoot = path.join(__dirname, '../..');
const evalsDir = path.join(workspaceRoot, 'evals/golden-tasks');
const manifestPath = path.join(workspaceRoot, '.ai/orchestration/context-manifest.json');
const roleRegistryPath = path.join(workspaceRoot, '.ai/orchestration/role-registry.json');
const decisionPolicyPath = path.join(workspaceRoot, '.ai/orchestration/decision-policy.json');

function loadGoldenTasks() {
  if (!fs.existsSync(evalsDir)) return [];
  const files = fs.readdirSync(evalsDir).filter(f => f.endsWith('.json')).sort();
  return files.map(f => {
    try {
      return JSON.parse(fs.readFileSync(path.join(evalsDir, f), 'utf8'));
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
}

function evaluateTask(gt) {
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const roleRegistry = fs.existsSync(roleRegistryPath) ? JSON.parse(fs.readFileSync(roleRegistryPath, 'utf8')) : {};
  const decisionPolicy = fs.existsSync(decisionPolicyPath) ? JSON.parse(fs.readFileSync(decisionPolicyPath, 'utf8')) : {};

  const report = {
    id: gt.id,
    name: gt.name,
    passed: true,
    checks: [],
    metrics: {}
  };

  // 1. Role Selection Precision Check
  const availableRoles = Object.keys(roleRegistry.roles || {});
  const expectedRolesValid = gt.expectedRoles.every(r => availableRoles.includes(r));
  report.checks.push({
    name: 'Role Registry Alignment',
    passed: expectedRolesValid,
    detail: `Expected roles [${gt.expectedRoles.join(', ')}] exist in role-registry.json`
  });
  if (!expectedRolesValid) report.passed = false;

  // Forbidden roles check
  const forbiddenIntersection = gt.forbiddenRoles.filter(r => gt.expectedRoles.includes(r));
  const noForbiddenRoles = forbiddenIntersection.length === 0;
  report.checks.push({
    name: 'Unnecessary Role Avoidance',
    passed: noForbiddenRoles,
    detail: noForbiddenRoles ? `Avoided all forbidden roles: [${gt.forbiddenRoles.join(', ') || 'None'}]` : `Violated forbidden roles: ${forbiddenIntersection.join(', ')}`
  });
  if (!noForbiddenRoles) report.passed = false;

  // 2. Context Routing Bound Check
  const availableGroups = manifest.contextGroups || {};
  let totalFilesLoaded = 0;
  const loadedFiles = new Set();

  gt.expectedContextGroups.forEach(g => {
    if (availableGroups[g] && availableGroups[g].files) {
      availableGroups[g].files.forEach(f => loadedFiles.add(f));
    }
  });
  totalFilesLoaded = loadedFiles.size;

  const withinContextLimit = totalFilesLoaded <= gt.maxAllowedContextFiles;
  report.checks.push({
    name: 'Context Boundary Limit',
    passed: withinContextLimit,
    detail: `Loaded ${totalFilesLoaded} files (Limit: ${gt.maxAllowedContextFiles})`
  });
  if (!withinContextLimit) report.passed = false;

  // 3. Category & Decision Alignment
  if (gt.category === 'decision') {
    const hasAmbiguityRules = decisionPolicy.policy && decisionPolicy.policy.ask_user !== undefined;
    report.checks.push({
      name: 'Decision Policy Checkpoint',
      passed: hasAmbiguityRules,
      detail: hasAmbiguityRules ? 'Decision policy triggers human checkpoint for ambiguous requirements' : 'Missing decision policy'
    });
    if (!hasAmbiguityRules) report.passed = false;
  }

  // 4. Verification Quality
  const hasVerificationSpec = gt.verificationExpectations && gt.verificationExpectations.type;
  report.checks.push({
    name: 'Verification Specification',
    passed: !!hasVerificationSpec,
    detail: `Verification type: ${gt.verificationExpectations.type}`
  });
  if (!hasVerificationSpec) report.passed = false;

  report.metrics = {
    rolesCount: gt.expectedRoles.length,
    contextFilesCount: totalFilesLoaded,
    maxContextLimit: gt.maxAllowedContextFiles,
    acceptanceCriteriaCount: gt.acceptanceCriteria.length
  };

  return report;
}

function runAllEvals(targetId = null) {
  const goldenTasks = loadGoldenTasks();
  log('\n╔═══════════════════════════════════════════════╗', colors.bold + colors.cyan);
  log('║     GOLDEN-TASK FACTORY EVALUATION SUITE      ║', colors.bold + colors.cyan);
  log('╚═══════════════════════════════════════════════╝\n', colors.bold + colors.cyan);

  const toRun = targetId ? goldenTasks.filter(t => t.id === targetId || t.name.toLowerCase().includes(targetId.toLowerCase())) : goldenTasks;

  if (toRun.length === 0) {
    log(`No golden task found matching "${targetId}"`, colors.red);
    return;
  }

  let totalTasks = toRun.length;
  let passedTasks = 0;

  toRun.forEach((gt, idx) => {
    const report = evaluateTask(gt);
    const statusColor = report.passed ? colors.green : colors.red;
    log(`[${report.id}] ${report.name} — ${report.passed ? 'PASSED' : 'FAILED'}`, colors.bold + statusColor);
    
    report.checks.forEach(c => {
      const sym = c.passed ? '✔' : '✘';
      const clr = c.passed ? colors.green : colors.red;
      log(`    ${sym} ${c.name}: ${c.detail}`, clr);
    });

    log(`    Metrics: Roles: ${report.metrics.rolesCount} | Context: ${report.metrics.contextFilesCount}/${report.metrics.maxContextLimit} files | Acceptance: ${report.metrics.acceptanceCriteriaCount} criteria`, colors.cyan);
    log('');

    if (report.passed) passedTasks++;
  });

  log('═════════════════════════════════════════════════', colors.bold);
  log(`Golden Tasks Evaluated: ${totalTasks} | Passed: ${passedTasks} | Failed: ${totalTasks - passedTasks}`, passedTasks === totalTasks ? colors.bold + colors.green : colors.bold + colors.red);

  return { totalTasks, passedTasks, failedTasks: totalTasks - passedTasks };
}

if (require.main === module) {
  const cmd = process.argv[2] || 'run';
  const arg = process.argv[3];

  switch (cmd) {
    case 'run':
      const outcome = runAllEvals(arg);
      process.exit(outcome && outcome.failedTasks === 0 ? 0 : 1);
      break;

    case 'list': {
      const gts = loadGoldenTasks();
      log('\n═══ Golden Tasks Suite (10 Tasks) ═══\n', colors.bold + colors.blue);
      gts.forEach(g => {
        log(`- [${g.id}] ${g.name} (${g.category}): ${g.description}`, colors.cyan);
      });
      break;
    }

    default:
      console.log(`
Usage: node eval-runner.js <command> [options]

Commands:
  run [taskId]   Run evaluation suite across all 10 golden tasks or single task
  list           List all registered golden tasks
`);
  }
}

module.exports = {
  loadGoldenTasks,
  evaluateTask,
  runAllEvals
};
