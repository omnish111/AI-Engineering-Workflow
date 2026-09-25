/**
 * Advanced Model Routing System (V2 Tier-B)
 * 
 * Selects appropriate abstract model tier (fast, standard, strong, critical)
 * based on task complexity, type, security sensitivity, and failure history.
 * 
 * Provider/model agnostic with configurable fallback behavior.
 * 
 * Usage:
 *   node .ai/scripts/model-router.js route --task <taskId>
 *   node .ai/scripts/model-router.js route --type <type> --complexity <S|M|L|XL> [--security] [--retries <n>]
 *   node .ai/scripts/model-router.js tiers
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
const routingPolicyPath = path.join(workspaceRoot, '.ai/orchestration/model-routing.json');
const tasksPath = path.join(workspaceRoot, '.ai/state/tasks.json');

const TIER_ORDER = ['fast', 'standard', 'strong', 'critical'];

function loadRoutingPolicy() {
  if (!fs.existsSync(routingPolicyPath)) {
    log('model-routing.json not found!', colors.red);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(routingPolicyPath, 'utf8'));
}

function resolveModelTier(taskInfo) {
  const policy = loadRoutingPolicy();
  const {
    type = 'backend',
    complexity = 'M',
    isSecurity = false,
    retries = 0,
    taskId = null
  } = taskInfo;

  // 1. Base Tier from Task Type
  let baseTier = policy.typeTierDefaults[type] || 'standard';
  let tierIndex = TIER_ORDER.indexOf(baseTier);
  const rationale = [`Base tier for type "${type}": ${baseTier}`];

  // 2. Complexity Escalation
  if (complexity === 'L' && tierIndex < 2) {
    tierIndex = Math.min(tierIndex + 1, TIER_ORDER.length - 1);
    rationale.push(`Promoted +1 level for Large (L) complexity -> ${TIER_ORDER[tierIndex]}`);
  } else if (complexity === 'XL' && tierIndex < 3) {
    tierIndex = Math.min(tierIndex + 2, TIER_ORDER.length - 1);
    rationale.push(`Promoted +2 levels for Extra Large (XL) complexity -> ${TIER_ORDER[tierIndex]}`);
  }

  // 3. Security Escalation
  if (isSecurity || type === 'security' || type === 'security-audit') {
    if (tierIndex < 3) {
      tierIndex = 3; // Promoted directly to 'critical'
      rationale.push(`Elevated to critical tier due to security sensitivity`);
    }
  }

  // 4. Retry History Escalation
  if (retries > 0) {
    const prev = TIER_ORDER[tierIndex];
    tierIndex = Math.min(tierIndex + 1, TIER_ORDER.length - 1);
    rationale.push(`Promoted for ${retries} previous retry attempt(s): ${prev} -> ${TIER_ORDER[tierIndex]}`);
  }

  const selectedTier = TIER_ORDER[tierIndex];
  const tierConfig = policy.tiers[selectedTier] || {};
  const fallbackTier = tierConfig.fallbackTier || 'standard';

  return {
    taskId,
    selectedTier,
    fallbackTier,
    recommendedModels: tierConfig.recommendedModels || [],
    costWeight: tierConfig.costWeight || 1,
    rationale
  };
}

function resolveFromTaskId(taskId) {
  if (!fs.existsSync(tasksPath)) {
    log('tasks.json not found', colors.red);
    process.exit(1);
  }
  const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  const task = (tasksData.tasks || []).find(t => t.id === taskId);
  if (!task) {
    log(`Task "${taskId}" not found in tasks.json`, colors.red);
    process.exit(1);
  }

  const isSecurity = task.type === 'security' || 
    (task.context && task.context.some(c => c.includes('security'))) ||
    (task.description && /security|auth|password|crypto|token/i.test(task.description));

  const retries = (task.retryPolicy && task.retryPolicy.currentRetries) || 0;

  return resolveModelTier({
    taskId: task.id,
    type: task.type || 'backend',
    complexity: task.complexity || 'M',
    isSecurity,
    retries
  });
}

// ─── CLI Router ───
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'tiers';

  if (command === 'tiers') {
    const policy = loadRoutingPolicy();
    log('\n═══ Abstract Model Routing Tiers ═══\n', colors.bold + colors.blue);
    Object.entries(policy.tiers).forEach(([key, val]) => {
      log(`• TIER [${key.toUpperCase()}] (Cost Weight: ${val.costWeight}x, Target Latency: ${val.targetLatencyMs}ms)`, colors.cyan);
      log(`    Description: ${val.description}`, colors.reset);
      log(`    Sample Models: ${val.recommendedModels.join(', ')}`, colors.green);
      log(`    Fallback Tier: ${val.fallbackTier}`, colors.yellow);
    });
  } else if (command === 'route') {
    let taskId = null;
    let type = 'backend';
    let complexity = 'M';
    let isSecurity = false;
    let retries = 0;

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--task' && args[i + 1]) taskId = args[++i];
      if (args[i] === '--type' && args[i + 1]) type = args[++i];
      if (args[i] === '--complexity' && args[i + 1]) complexity = args[++i].toUpperCase();
      if (args[i] === '--security') isSecurity = true;
      if (args[i] === '--retries' && args[i + 1]) retries = parseInt(args[++i], 10);
    }

    const outcome = taskId 
      ? resolveFromTaskId(taskId) 
      : resolveModelTier({ type, complexity, isSecurity, retries });

    log('\n═══ Model Tier Routing Decision ═══\n', colors.bold + colors.blue);
    if (outcome.taskId) log(`Task ID:            ${outcome.taskId}`, colors.cyan);
    log(`Selected Tier:      ${colors.bold}${outcome.selectedTier.toUpperCase()}${colors.reset}`, colors.green);
    log(`Fallback Tier:      ${outcome.fallbackTier.toUpperCase()}`, colors.yellow);
    log(`Recommended Models: ${outcome.recommendedModels.join(', ')}`, colors.cyan);
    log(`Relative Cost:      ${outcome.costWeight}x base`, colors.reset);
    log('\nRouting Rationale:', colors.bold);
    outcome.rationale.forEach(r => log(`  - ${r}`, colors.reset));
    log('');
  } else {
    console.log(`
Usage: node model-router.js <command> [options]

Commands:
  tiers                                               Show all defined abstract model tiers
  route --task <taskId>                               Route model tier using task DAG metadata
  route --type <type> --complexity <S|M|L|XL> [...]   Route model tier with explicit parameters
`);
  }
}

module.exports = {
  loadRoutingPolicy,
  resolveModelTier,
  resolveFromTaskId,
  TIER_ORDER
};
