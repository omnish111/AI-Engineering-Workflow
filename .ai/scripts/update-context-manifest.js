/**
 * Automatic Context-Manifest Maintenance System (V2 Tier-B)
 * 
 * Inspects repository structure and maintains context routing deterministically.
 * Separates AUTO-DISCOVERED CONTEXT from MANUALLY OVERRIDDEN CONTEXT.
 * 
 * Usage:
 *   node .ai/scripts/update-context-manifest.js discover   — Scan codebase & generate context-discovery.json
 *   node .ai/scripts/update-context-manifest.js validate   — Verify all referenced context paths exist
 *   node .ai/scripts/update-context-manifest.js diff       — Show pending changes without applying
 *   node .ai/scripts/update-context-manifest.js apply      — Compile discovery + overrides into context-manifest.json
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
const orchestrationDir = path.join(workspaceRoot, '.ai/orchestration');
const manifestPath = path.join(orchestrationDir, 'context-manifest.json');
const discoveryPath = path.join(orchestrationDir, 'context-discovery.json');
const overridesPath = path.join(orchestrationDir, 'context-overrides.json');

// ─── Discovery Engine ───
function scanDirectoryFiles(dirRel, pattern = null) {
  const dirAbs = path.join(workspaceRoot, dirRel);
  if (!fs.existsSync(dirAbs)) return [];
  const results = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.name.startsWith('.') || ent.name === 'node_modules' || ent.name === 'dist' || ent.name === 'build') {
        continue;
      }
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile()) {
        const rel = path.relative(workspaceRoot, full).replace(/\\/g, '/');
        if (!pattern || pattern.test(rel)) {
          results.push(rel);
        }
      }
    }
  }

  walk(dirAbs);
  return results;
}

function discoverContext() {
  log('Scanning repository for context discovery...', colors.bold + colors.blue);

  // 1. Discover Skills (.agents/skills canonical, fallback .ai/skills)
  const agentSkillsDir = path.join(workspaceRoot, '.agents/skills');
  const aiSkillsDir = path.join(workspaceRoot, '.ai/skills');
  const discoveredSkills = {};

  const scanSkillsIn = (dir, prefix) => {
    if (fs.existsSync(dir)) {
      const skillDirs = fs.readdirSync(dir, { withFileTypes: true });
      for (const s of skillDirs) {
        if (s.isDirectory()) {
          const skillMd = `${prefix}/${s.name}/SKILL.md`;
          if (fs.existsSync(path.join(workspaceRoot, skillMd))) {
            discoveredSkills[s.name] = skillMd;
          }
        }
      }
    }
  };

  scanSkillsIn(aiSkillsDir, '.ai/skills');
  scanSkillsIn(agentSkillsDir, '.agents/skills');

  // 2. Discover Context Rules & Documentation (.agents/rules canonical)
  const contextRules = scanDirectoryFiles('.agents/rules', /\.md$/).concat(scanDirectoryFiles('.ai/context', /\.md$/));
  const docs = scanDirectoryFiles('doc', /\.md$/).concat(scanDirectoryFiles('docs', /\.md$/));

  // 3. Discover Codebase Modules
  const backendFiles = scanDirectoryFiles('codebase/backend', /\.(ts|js|json)$/);
  const frontendFiles = scanDirectoryFiles('codebase/frontend', /\.(ts|tsx|js|jsx|json|css)$/);
  const testFiles = scanDirectoryFiles('codebase/backend/test', /\.(test|spec)\.(ts|js)$/);

  // Helper to pick best existing skill path
  const pickSkill = (candidates) => {
    for (const name of candidates) {
      if (discoveredSkills[name]) return discoveredSkills[name];
    }
    return null;
  };

  // Build Discovered Groups
  const discoveredGroups = {
    backend: {
      description: 'Backend implementation and services context',
      files: [
        pickSkill(['implementing-backend', 'backend']) || '.agents/skills/implementing-backend/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/coding-rules.md')) ? '.agents/rules/coding-rules.md' : '.ai/context/coding-rules.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/architecture-rules.md')) ? '.agents/rules/architecture-rules.md' : '.ai/context/architecture-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    frontend: {
      description: 'Frontend UI and client components context',
      files: [
        pickSkill(['implementing-frontend', 'frontend']) || '.agents/skills/implementing-frontend/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/ui-guidelines.md')) ? '.agents/rules/ui-guidelines.md' : '.ai/context/ui-guidelines.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/coding-rules.md')) ? '.agents/rules/coding-rules.md' : '.ai/context/coding-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    database: {
      description: 'Database models, entities and repositories context',
      files: [
        pickSkill(['designing-database', 'database']) || '.agents/skills/designing-database/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/architecture-rules.md')) ? '.agents/rules/architecture-rules.md' : '.ai/context/architecture-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    security: {
      description: 'Security rules, authentication and auditing context',
      files: [
        pickSkill(['securing-applications', 'security']) || '.agents/skills/securing-applications/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/security.md')) ? '.agents/rules/security.md' : '.ai/context/coding-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    testing: {
      description: 'Test execution, suites and coverage rules',
      files: [
        pickSkill(['testing-software', 'testing']) || '.agents/skills/testing-software/SKILL.md',
        pickSkill(['verifying-changes', 'verification']) || '.agents/skills/verifying-changes/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/coding-rules.md')) ? '.agents/rules/coding-rules.md' : '.ai/context/coding-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    planning: {
      description: 'Planning, architecture and PRD requirements',
      files: [
        pickSkill(['planning']) || '.agents/skills/planning/SKILL.md',
        pickSkill(['analyzing-prd', 'prd-analysis']) || '.agents/skills/analyzing-prd/SKILL.md',
        pickSkill(['designing-architecture', 'architecture']) || '.agents/skills/designing-architecture/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/architecture-rules.md')) ? '.agents/rules/architecture-rules.md' : '.ai/context/architecture-rules.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/tech-stack.md')) ? '.agents/rules/tech-stack.md' : '.ai/context/tech-stack.md',
        'doc/prd.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    review: {
      description: 'Code review and verification guidelines',
      files: [
        pickSkill(['reviewing-code', 'code-review']) || '.agents/skills/reviewing-code/SKILL.md',
        pickSkill(['verifying-changes', 'verification']) || '.agents/skills/verifying-changes/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/coding-rules.md')) ? '.agents/rules/coding-rules.md' : '.ai/context/coding-rules.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/architecture-rules.md')) ? '.agents/rules/architecture-rules.md' : '.ai/context/architecture-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    deployment: {
      description: 'Deployment, containers and infrastructure rules',
      files: [
        pickSkill(['deploying-software', 'deployment']) || '.agents/skills/deploying-software/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/tech-stack.md')) ? '.agents/rules/tech-stack.md' : '.ai/context/tech-stack.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    'bug-fix': {
      description: 'Bug debugging and regression context',
      files: [
        pickSkill(['debugging-software', 'debugging', 'bug-fix']) || '.agents/skills/debugging-software/SKILL.md',
        pickSkill(['testing-software', 'testing']) || '.agents/skills/testing-software/SKILL.md',
        fs.existsSync(path.join(workspaceRoot, '.agents/rules/coding-rules.md')) ? '.agents/rules/coding-rules.md' : '.ai/context/coding-rules.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    },
    evaluation: {
      description: 'Independent evaluation and outcome grading context',
      files: [
        pickSkill(['evaluating-results']) || '.agents/skills/evaluating-results/SKILL.md',
        pickSkill(['verifying-changes', 'verification']) || '.agents/skills/verifying-changes/SKILL.md'
      ].filter(f => fs.existsSync(path.join(workspaceRoot, f)))
    }
  };

  const discoveryPayload = {
    version: '2.0',
    lastDiscovered: new Date().toISOString(),
    inventory: {
      skillsCount: Object.keys(discoveredSkills).length,
      contextRulesCount: contextRules.length,
      docsCount: docs.length,
      backendFilesCount: backendFiles.length,
      frontendFilesCount: frontendFiles.length,
      testFilesCount: testFiles.length
    },
    discoveredGroups
  };

  fs.writeFileSync(discoveryPath, JSON.stringify(discoveryPayload, null, 2));
  log(`✔ Context discovery completed. Saved to ${path.relative(workspaceRoot, discoveryPath)}`, colors.green);
  log(`  Found: ${discoveryPayload.inventory.skillsCount} skills, ${contextRules.length} context rules, ${testFiles.length} test files, ${backendFiles.length + frontendFiles.length} source files.`, colors.cyan);

  return discoveryPayload;
}

// ─── Compilation & Merging ───
function compileManifest() {
  let discovery = {};
  if (fs.existsSync(discoveryPath)) {
    try {
      discovery = JSON.parse(fs.readFileSync(discoveryPath, 'utf8')).discoveredGroups || {};
    } catch (e) {
      log('Warning: Unable to parse context-discovery.json, discovering fresh.', colors.yellow);
      discovery = discoverContext().discoveredGroups;
    }
  } else {
    discovery = discoverContext().discoveredGroups;
  }

  let overrides = { manualContextGroups: {}, taskTypeToContextGroups: {} };
  if (fs.existsSync(overridesPath)) {
    try {
      overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
    } catch (e) {
      log('Error parsing context-overrides.json', colors.red);
    }
  }

  // Merge discovered groups with overrides (overrides take precedence)
  const mergedGroups = { ...discovery };

  // Apply manual context groups
  if (overrides.manualContextGroups) {
    Object.entries(overrides.manualContextGroups).forEach(([groupName, groupDef]) => {
      mergedGroups[groupName] = groupDef;
    });
  }

  const compiled = {
    version: '2.0',
    description: 'Context routing manifest — maps task types to required context files',
    generatedAt: new Date().toISOString(),
    contextGroups: mergedGroups,
    taskTypeToContextGroups: overrides.taskTypeToContextGroups || {},
    rules: [
      "Always load 'core' context group",
      "Load additional groups based on task classification",
      "When task affects both backend and frontend, load both groups",
      "When task involves auth/security, always load security group",
      "When resuming, always load state group",
      "Never load all groups simultaneously unless explicitly needed"
    ]
  };

  return compiled;
}

// ─── Validation Engine ───
function validateManifest() {
  log('\n═══ Context Manifest Validation ═══\n', colors.bold + colors.blue);
  if (!fs.existsSync(manifestPath)) {
    log('✘ context-manifest.json not found!', colors.red);
    return false;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    log(`✘ Malformed context-manifest.json: ${err.message}`, colors.red);
    return false;
  }

  let errors = 0;
  const groups = manifest.contextGroups || {};

  Object.entries(groups).forEach(([name, grp]) => {
    if (!grp.files || !Array.isArray(grp.files)) {
      log(`✘ Context group "${name}" missing files array`, colors.red);
      errors++;
      return;
    }

    grp.files.forEach(file => {
      const fullPath = path.join(workspaceRoot, file);
      if (!fs.existsSync(fullPath)) {
        log(`✘ Group "${name}": file not found: ${file}`, colors.red);
        errors++;
      }
    });
  });

  if (errors === 0) {
    log(`✔ All context group references are valid (${Object.keys(groups).length} groups verified).`, colors.green);
    return true;
  } else {
    log(`✘ Validation failed with ${errors} broken path reference(s).`, colors.red);
    return false;
  }
}

// ─── Diff Engine ───
function diffManifest() {
  log('\n═══ Context Manifest Diff ═══\n', colors.bold + colors.blue);
  const current = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const compiled = compileManifest();

  const currentGroups = Object.keys(current.contextGroups || {});
  const newGroups = Object.keys(compiled.contextGroups || {});

  let hasDiff = false;

  // Check added/removed groups
  const addedGroups = newGroups.filter(g => !currentGroups.includes(g));
  const removedGroups = currentGroups.filter(g => !newGroups.includes(g));

  if (addedGroups.length > 0) {
    hasDiff = true;
    log(`+ Added groups: ${addedGroups.join(', ')}`, colors.green);
  }
  if (removedGroups.length > 0) {
    hasDiff = true;
    log(`- Removed groups: ${removedGroups.join(', ')}`, colors.red);
  }

  // Check modified groups
  newGroups.forEach(g => {
    if (current.contextGroups && current.contextGroups[g]) {
      const oldFiles = current.contextGroups[g].files || [];
      const nextFiles = compiled.contextGroups[g].files || [];

      const added = nextFiles.filter(f => !oldFiles.includes(f));
      const removed = oldFiles.filter(f => !nextFiles.includes(f));

      if (added.length > 0 || removed.length > 0) {
        hasDiff = true;
        log(`~ Group "${g}" changes:`, colors.yellow);
        added.forEach(f => log(`    + ${f}`, colors.green));
        removed.forEach(f => log(`    - ${f}`, colors.red));
      }
    }
  });

  if (!hasDiff) {
    log('✔ No differences. context-manifest.json is up-to-date.', colors.green);
  }

  return { hasDiff, compiled };
}

// ─── Apply Engine ───
function applyManifest() {
  const { compiled } = diffManifest();
  fs.writeFileSync(manifestPath, JSON.stringify(compiled, null, 2));
  log('✔ Successfully applied compiled manifest to context-manifest.json', colors.green);
  validateManifest();
}

// ─── CLI Router ───
if (require.main === module) {
  const cmd = process.argv[2];

  switch (cmd) {
    case 'discover':
      discoverContext();
      break;
    case 'validate':
      const valid = validateManifest();
      process.exit(valid ? 0 : 1);
      break;
    case 'diff':
      diffManifest();
      break;
    case 'apply':
      applyManifest();
      break;
    default:
      console.log(`
Usage: node update-context-manifest.js <command>

Commands:
  discover    Scan codebase for modules, skills, docs, and write context-discovery.json
  validate    Ensure all file paths referenced in context-manifest.json exist
  diff        Show differences between active manifest and compiled discovery + overrides
  apply       Compile and write discovery + overrides into context-manifest.json
`);
  }
}

module.exports = {
  discoverContext,
  validateManifest,
  diffManifest,
  applyManifest,
  compileManifest
};
