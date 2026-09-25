/**
 * V2 Dry-Run Scenario Validator
 * 
 * Validates the 7 required scenarios from the V2 specification.
 * This is a static analysis / simulation — no actual code generation.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

let passed = 0;
let failed = 0;

function assert(condition, desc) {
  if (condition) {
    log(`  ✔ ${desc}`, colors.green);
    passed++;
  } else {
    log(`  ✘ ${desc}`, colors.red);
    failed++;
  }
}

// Load orchestration files
const roleRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, '../orchestration/role-registry.json'), 'utf8'));
const contextManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../orchestration/context-manifest.json'), 'utf8'));
const decisionPolicy = JSON.parse(fs.readFileSync(path.join(__dirname, '../orchestration/decision-policy.json'), 'utf8'));
const checkpointPolicy = JSON.parse(fs.readFileSync(path.join(__dirname, '../orchestration/checkpoint-policy.json'), 'utf8'));
const tasksData = JSON.parse(fs.readFileSync(path.join(__dirname, '../state/tasks.json'), 'utf8'));
const projectData = JSON.parse(fs.readFileSync(path.join(__dirname, '../state/project.json'), 'utf8'));

// ─── Scenario 1: Simple frontend change ───
log('\n═══ Scenario 1: Simple Frontend Change ═══', colors.bold + colors.blue);
{
  const taskType = 'simple-fix';
  const roles = roleRegistry.taskTypeToRoles[taskType];
  assert(roles.length <= 3, `Only ${roles.length} roles selected (not all agents)`);
  assert(!roles.includes('planner'), 'No planner explosion');
  assert(!roles.includes('architect'), 'No architect needed');
  assert(roles.includes('implementer'), 'Implementer selected');
  assert(roles.includes('verifier'), 'Verifier selected');

  const contextGroups = contextManifest.taskTypeToContextGroups[taskType];
  assert(contextGroups.length <= 3, `Only ${contextGroups.length} context groups loaded`);
}

// ─── Scenario 2: Authentication feature ───
log('\n═══ Scenario 2: Authentication Feature ═══', colors.bold + colors.blue);
{
  const taskType = 'security-change';
  const roles = roleRegistry.taskTypeToRoles[taskType];
  assert(roles.includes('planner'), 'Planner selected');
  assert(roles.includes('implementer'), 'Implementer selected');
  assert(roles.includes('verifier'), 'Verifier selected');
  assert(roles.includes('reviewer'), 'Reviewer selected');

  const contextGroups = contextManifest.taskTypeToContextGroups[taskType];
  assert(contextGroups.includes('security'), 'Security context loaded');
  assert(contextGroups.includes('backend'), 'Backend context loaded');
  assert(contextGroups.includes('testing'), 'Testing context loaded');
}

// ─── Scenario 3: Independent backend + frontend tasks ───
log('\n═══ Scenario 3: Independent Backend + Frontend Tasks ═══', colors.bold + colors.blue);
{
  // Simulate two independent tasks
  const backendTask = {
    id: 'TEST-001', description: 'Backend API', status: 'READY',
    dependsOn: [], outputs: ['codebase/backend/modules/users/']
  };
  const frontendTask = {
    id: 'TEST-002', description: 'Frontend UI', status: 'READY',
    dependsOn: [], outputs: ['codebase/frontend/components/users/']
  };

  // Check for output conflicts
  const allOutputs = [...backendTask.outputs, ...frontendTask.outputs];
  const unique = new Set(allOutputs);
  assert(unique.size === allOutputs.length, 'No output path conflicts');
  assert(backendTask.dependsOn.length === 0 && frontendTask.dependsOn.length === 0,
    'Tasks are independent DAG nodes');
  
  const implementerRole = roleRegistry.roles.implementer;
  assert(implementerRole.canParallelize === true, 'Implementer role supports parallelization');
}

// ─── Scenario 4: Failed task ───
log('\n═══ Scenario 4: Failed Task ═══', colors.bold + colors.blue);
{
  const validTransitions = tasksData.validTransitions;
  assert(validTransitions.FAILED.includes('RETRYING'), 'Failed tasks can retry');
  assert(validTransitions.FAILED.includes('BLOCKED'), 'Failed tasks can become blocked');
  assert(validTransitions.COMPLETED.length === 0, 'Completed tasks stay completed');
  assert(!validTransitions.COMPLETED.includes('FAILED'), 'Completed tasks never go to FAILED');
}

// ─── Scenario 5: Ambiguous requirement ───
log('\n═══ Scenario 5: Ambiguous Requirement ═══', colors.bold + colors.blue);
{
  const askPolicy = decisionPolicy.policy.ask_user;
  assert(askPolicy.conditions.length > 0, 'Ask-user conditions defined');
  assert(askPolicy.conditions.some(c => c.includes('genuinely ambiguous')),
    'Ambiguous requirements trigger user question');

  const actPolicy = decisionPolicy.policy.act_immediately;
  assert(actPolicy.conditions.length > 0, 'Act-immediately conditions defined');
}

// ─── Scenario 6: Known decision ───
log('\n═══ Scenario 6: Known Decision ═══', colors.bold + colors.blue);
{
  const inferPolicy = decisionPolicy.policy.infer_and_act;
  assert(inferPolicy.minimumConfidence === 0.85, 'Inference confidence threshold set');
  assert(inferPolicy.requirement.includes('Log the inference'),
    'Inferred decisions must be logged');

  const actPolicy = decisionPolicy.policy.act_immediately;
  assert(actPolicy.examples.length > 0, 'Known decision examples provided');
}

// ─── Scenario 7: Restart/resume ───
log('\n═══ Scenario 7: Restart/Resume ═══', colors.bold + colors.blue);
{
  assert(fs.existsSync(path.join(__dirname, '../state/project.json')),
    'project.json exists for resume');
  assert(fs.existsSync(path.join(__dirname, '../state/tasks.json')),
    'tasks.json exists for resume');
  assert(projectData.status !== undefined, 'Project status is readable');
  assert(projectData.stateVersion !== undefined, 'State version tracking exists');
  assert(Array.isArray(tasksData.tasks), 'Task array exists for resume');
}

// ─── Additional: Structure validation ───
log('\n═══ Additional: Structure Validation ═══', colors.bold + colors.blue);
{
  // Check all required files exist
  const requiredFiles = [
    '../agents/orchestrator.md',
    '../orchestration/role-registry.json',
    '../orchestration/task-classifier.md',
    '../orchestration/decision-policy.json',
    '../orchestration/context-manifest.json',
    '../orchestration/context-router.md',
    '../orchestration/checkpoint-policy.json',
    '../orchestration/verification-schema.json',
    '../orchestration/parallel-policy.md',
    '../state/project.json',
    '../state/tasks.json',
    '../state/agents.json',
    '../state/decisions.json',
    '../state/blockers.json',
    '../state/events.jsonl'
  ];

  for (const f of requiredFiles) {
    const fullPath = path.join(__dirname, f);
    assert(fs.existsSync(fullPath), `File exists: ${path.basename(f)}`);
  }

  // Check skills
  const expectedSkills = [
    'project-init', 'prd-analysis', 'planning', 'architecture',
    'backend', 'frontend', 'database', 'testing', 'security',
    'debugging', 'deployment', 'bug-fix', 'feature-development',
    'verification', 'api', 'code-review', 'docker', 'documentation',
    'git', 'uiux'
  ];

  for (const skill of expectedSkills) {
    const skillPath = path.join(__dirname, `../skills/${skill}/SKILL.md`);
    assert(fs.existsSync(skillPath), `Skill exists: ${skill}/SKILL.md`);
  }

  // Check archive
  assert(fs.existsSync(path.join(__dirname, '../archive/v1/agents/super-agent.md')),
    'V1 super-agent archived');
}

// ─── Summary ───
log('\n══════════════════════════════════', colors.bold);
log(`Total: ${passed + failed} checks | Passed: ${passed} | Failed: ${failed}`,
  failed === 0 ? colors.green : colors.red);

process.exit(failed === 0 ? 0 : 1);
