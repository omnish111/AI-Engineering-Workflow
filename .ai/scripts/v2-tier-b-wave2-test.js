/**
 * V2 Tier-B Wave 2 Verification Suite
 * 
 * Verifies B4, B5, B6, B7, and B8:
 * - B4: Scheduled maintenance automation & report generation
 * - B5: Engineering telemetry recording, zero-secrets sanitization & efficiency
 * - B6: Golden-task evaluation runner across all 10 benchmark tasks
 * - B7: Abstract model routing, escalation heuristics & fallback behavior
 * - B8: Multi-project state isolation & registry switching
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
const { runCadence } = require('./maintenance-runner');
const { recordTelemetryEvent, sanitizePayload } = require('./telemetry-report');
const { runAllEvals } = require('./eval-runner');
const { resolveModelTier } = require('./model-router');
const { createProject, switchProject, loadRegistry } = require('./project-manager');

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

// ─── Test B4: Scheduled Maintenance ───
function testMaintenance() {
  log('\n═══ Test B4: Scheduled Maintenance Runner ═══', colors.bold + colors.blue);
  const report = runCadence('daily');
  assert(report !== null, 'Daily maintenance cadence executed');
  assert(report.failures === 0, 'Zero failures reported during daily maintenance');
  assert(report.totalChecks >= 3, `Executed ${report.totalChecks} scheduled checks`);
}

// ─── Test B5: Engineering Telemetry ───
function testTelemetry() {
  log('\n═══ Test B5: Engineering Telemetry & Sanitization ═══', colors.bold + colors.blue);
  
  // Test sanitization
  const sensitivePayload = {
    taskId: 'TASK-TEST',
    secretKey: 'my-super-secret-password-123',
    authToken: 'bearer-token-value',
    status: 'OK'
  };
  const sanitized = sanitizePayload(sensitivePayload);
  assert(sanitized.secretKey === '[REDACTED]', 'Sensitive key redacted');
  assert(sanitized.authToken === '[REDACTED]', 'Auth token redacted');
  assert(sanitized.status === 'OK', 'Non-sensitive field preserved');

  // Test recording
  const recorded = recordTelemetryEvent({
    taskId: 'TASK-WAVE2-TEST',
    role: 'implementer',
    durationMs: 120,
    result: 'COMPLETED',
    contextCount: 3
  });
  assert(recorded.timestamp !== undefined, 'Telemetry timestamp attached');
  assert(recorded.taskId === 'TASK-WAVE2-TEST', 'Task ID recorded in telemetry stream');
}

// ─── Test B6: Golden-Task Evaluation ───
function testGoldenEvals() {
  log('\n═══ Test B6: Golden-Task Evaluation Suite ═══', colors.bold + colors.blue);
  const evalOutcome = runAllEvals();
  assert(evalOutcome.totalTasks === 10, 'All 10 representative golden tasks evaluated');
  assert(evalOutcome.passedTasks === 10, '100% pass rate on golden task evaluations (10/10)');
  assert(evalOutcome.failedTasks === 0, 'Zero evaluation failures');
}

// ─── Test B7: Advanced Model Routing ───
function testModelRouting() {
  log('\n═══ Test B7: Advanced Model Routing ═══', colors.bold + colors.blue);

  // Simple fix -> fast tier
  const resFast = resolveModelTier({ type: 'simple-fix', complexity: 'S' });
  assert(resFast.selectedTier === 'fast', 'simple-fix routes to fast tier');

  // Normal backend -> standard tier
  const resStandard = resolveModelTier({ type: 'backend', complexity: 'M' });
  assert(resStandard.selectedTier === 'standard', 'normal backend CRUD routes to standard tier');

  // Architecture/planning -> strong tier
  const resStrong = resolveModelTier({ type: 'planning', complexity: 'L' });
  assert(resStrong.selectedTier === 'strong', 'complex planning routes to strong tier');

  // Security sensitive -> critical tier
  const resCritical = resolveModelTier({ type: 'backend', complexity: 'M', isSecurity: true });
  assert(resCritical.selectedTier === 'critical', 'security-sensitive task escalates to critical tier');

  // Retry escalation
  const resRetry = resolveModelTier({ type: 'backend', complexity: 'M', retries: 1 });
  assert(resRetry.selectedTier === 'strong', 'retry history escalates standard -> strong tier');

  // Fallback check
  assert(resCritical.fallbackTier === 'strong', 'critical tier has fallback to strong');
}

// ─── Test B8: Multi-Project Support ───
function testMultiProject() {
  log('\n═══ Test B8: Multi-Project State Isolation ═══', colors.bold + colors.blue);
  const testProjId = 'test-isolated-proj';
  const testProjName = 'Isolated Test Project';
  const registryPath = path.join(workspaceRoot, '.ai/projects/registry.json');
  const originalRegistry = fs.readFileSync(registryPath, 'utf8');

  try {
    createProject(testProjId, testProjName);
    const reg = loadRegistry();
    assert(reg.projects[testProjId] !== undefined, 'New project registered in registry.json');

    const isolatedStatePath = path.join(workspaceRoot, '.ai/projects', testProjId, 'state/project.json');
    assert(fs.existsSync(isolatedStatePath), 'Isolated project.json created under project directory');

    // Switch project
    switchProject(testProjId);
    const switchedReg = loadRegistry();
    assert(switchedReg.activeProjectId === testProjId, 'Active project switched in registry');

    // Switch back to default
    switchProject('default-saas');
    const restoredReg = loadRegistry();
    assert(restoredReg.activeProjectId === 'default-saas', 'Active project restored to default-saas');

    // Verify main state is unpolluted
    const mainState = JSON.parse(fs.readFileSync(path.join(workspaceRoot, '.ai/state/project.json'), 'utf8'));
    assert(mainState.name === 'AI Engineering Workflow' || mainState.name === 'SaaS AI Factory', 'Main workspace state remains unpolluted');

  } finally {
    fs.writeFileSync(registryPath, originalRegistry);
    const testDir = path.join(workspaceRoot, '.ai/projects', testProjId);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  }
}

// ─── Run All Wave 2 Tests ───
log('\n╔═══════════════════════════════════════════════╗', colors.bold + colors.cyan);
log('║   V2 TIER-B WAVE 2 AUTOMATED TEST SUITE       ║', colors.bold + colors.cyan);
log('╚═══════════════════════════════════════════════╝', colors.bold + colors.cyan);

testMaintenance();
testTelemetry();
testGoldenEvals();
testModelRouting();
testMultiProject();

log('\n═════════════════════════════════════════════════', colors.bold);
log(`Total Wave 2 Checks: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`, failedChecks === 0 ? colors.bold + colors.green : colors.bold + colors.red);

process.exit(failedChecks === 0 ? 0 : 1);
