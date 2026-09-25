/**
 * Multi-Project Isolation Manager (V2 Tier-B)
 * 
 * Manages multiple independent projects within the factory without mixing state.
 * Each project maintains isolated:
 * - State database (.ai/state or .ai/projects/<id>/state)
 * - Task graphs (tasks.json)
 * - Agent sessions (agents.json)
 * - Telemetry & Decison logs
 * 
 * Usage:
 *   node .ai/scripts/project-manager.js list
 *   node .ai/scripts/project-manager.js create <id> <name>
 *   node .ai/scripts/project-manager.js switch <id>
 *   node .ai/scripts/project-manager.js status [id]
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
const projectsBaseDir = path.join(workspaceRoot, '.ai/projects');
const registryPath = path.join(projectsBaseDir, 'registry.json');

if (!fs.existsSync(projectsBaseDir)) {
  fs.mkdirSync(projectsBaseDir, { recursive: true });
}

function loadRegistry() {
  if (!fs.existsSync(registryPath)) {
    const initial = {
      version: '2.0',
      activeProjectId: 'default-saas',
      projects: {
        'default-saas': {
          id: 'default-saas',
          name: 'SaaS AI Factory (Core)',
          stateDir: '.ai/state',
          telemetryDir: '.ai/telemetry',
          createdAt: new Date().toISOString()
        }
      }
    };
    fs.writeFileSync(registryPath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

function saveRegistry(reg) {
  fs.writeFileSync(registryPath, JSON.stringify(reg, null, 2));
}

function listProjects() {
  const reg = loadRegistry();
  log('\n═══ Multi-Project Registry ═══\n', colors.bold + colors.blue);
  log(`Active Project: ${colors.bold}${colors.green}${reg.activeProjectId}${colors.reset}\n`);

  Object.values(reg.projects).forEach(p => {
    const isActive = p.id === reg.activeProjectId;
    const prefix = isActive ? '▶ ' : '  ';
    const color = isActive ? colors.bold + colors.green : colors.reset;
    log(`${prefix}[${p.id}] ${p.name}`, color);
    log(`     State:     ${p.stateDir}`, colors.cyan);
    log(`     Created:   ${p.createdAt}`, colors.reset);
  });
  log('');
}

function createProject(id, name) {
  if (!id || !name) {
    log('Usage: node project-manager.js create <id> <name>', colors.red);
    process.exit(1);
  }

  const reg = loadRegistry();
  if (reg.projects[id]) {
    log(`Project "${id}" already exists!`, colors.red);
    process.exit(1);
  }

  const projDir = path.join(projectsBaseDir, id);
  const stateDir = path.join(projDir, 'state');
  const telemetryDir = path.join(projDir, 'telemetry');

  fs.mkdirSync(stateDir, { recursive: true });
  fs.mkdirSync(telemetryDir, { recursive: true });

  // Initialize isolated state files
  fs.writeFileSync(path.join(stateDir, 'project.json'), JSON.stringify({
    version: '2.0',
    id,
    name,
    status: 'AWAITING_PRD',
    createdAt: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    totalPhases: 0,
    completedPhases: 0,
    activeBlockers: 0
  }, null, 2));

  fs.writeFileSync(path.join(stateDir, 'tasks.json'), JSON.stringify({
    version: '2.0',
    projectId: id,
    tasks: [],
    phases: []
  }, null, 2));

  fs.writeFileSync(path.join(stateDir, 'agents.json'), JSON.stringify({
    version: '2.0',
    projectId: id,
    activeRoles: [],
    roleHistory: []
  }, null, 2));

  fs.writeFileSync(path.join(stateDir, 'decisions.json'), JSON.stringify({
    version: '2.0',
    projectId: id,
    decisions: []
  }, null, 2));

  fs.writeFileSync(path.join(stateDir, 'blockers.json'), JSON.stringify({
    version: '2.0',
    projectId: id,
    blockers: []
  }, null, 2));

  fs.writeFileSync(path.join(stateDir, 'events.jsonl'), '');

  const relState = path.relative(workspaceRoot, stateDir).replace(/\\/g, '/');
  const relTele = path.relative(workspaceRoot, telemetryDir).replace(/\\/g, '/');

  reg.projects[id] = {
    id,
    name,
    stateDir: relState,
    telemetryDir: relTele,
    createdAt: new Date().toISOString()
  };

  saveRegistry(reg);
  log(`✔ Isolated project "${name}" [${id}] created successfully.`, colors.green);
  log(`  State Directory: ${relState}`, colors.cyan);
}

function switchProject(id) {
  if (!id) {
    log('Usage: node project-manager.js switch <id>', colors.red);
    process.exit(1);
  }

  const reg = loadRegistry();
  if (!reg.projects[id]) {
    log(`Project "${id}" not found in registry!`, colors.red);
    process.exit(1);
  }

  reg.activeProjectId = id;
  reg.projects[id].lastActiveAt = new Date().toISOString();
  saveRegistry(reg);

  log(`✔ Active project switched to: [${id}] ${reg.projects[id].name}`, colors.green);
}

function getProjectStatus(targetId = null) {
  const reg = loadRegistry();
  const id = targetId || reg.activeProjectId;
  const project = reg.projects[id];

  if (!project) {
    log(`Project "${id}" not found!`, colors.red);
    process.exit(1);
  }

  log(`\n═══ Status for Project [${id}]: ${project.name} ═══\n`, colors.bold + colors.blue);
  const statePath = path.join(workspaceRoot, project.stateDir, 'project.json');
  const tasksPath = path.join(workspaceRoot, project.stateDir, 'tasks.json');

  if (fs.existsSync(statePath)) {
    const projState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    log(`Status:         ${projState.status}`, colors.cyan);
    log(`Total Phases:   ${projState.totalPhases || 0}`, colors.reset);
    log(`Completed:      ${projState.completedPhases || 0}`, colors.green);
  }

  if (fs.existsSync(tasksPath)) {
    const taskState = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
    const tasks = taskState.tasks || [];
    log(`Tasks in DAG:   ${tasks.length}`, colors.cyan);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'list';

  switch (cmd) {
    case 'list':
      listProjects();
      break;
    case 'create':
      createProject(args[1], args[2]);
      break;
    case 'switch':
      switchProject(args[1]);
      break;
    case 'status':
      getProjectStatus(args[1]);
      break;
    default:
      console.log(`
Usage: node project-manager.js <command> [options]

Commands:
  list              List all registered projects and active project
  create <id> <name> Create an isolated project environment
  switch <id>       Switch the currently active project
  status [id]       Inspect isolated state of a project
`);
  }
}

module.exports = {
  loadRegistry,
  createProject,
  switchProject,
  getProjectStatus
};
