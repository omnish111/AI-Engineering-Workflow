/**
 * dna-stamper.js
 * Stamps portable engineering DNA (.ai/, .agents/, AGENTS.md, GEMINI.md) into any target project directory.
 * Approach A: Full V2 Autonomous Project Engine.
 * Pure Node.js - Zero external npm dependencies.
 */

const fs = require('fs');
const path = require('path');

const FACTORY_ROOT = path.join(__dirname, '../..');
const TEMPLATES_DIR = path.join(__dirname, '../templates/dna');

// 19 Execution skills relevant to standalone web/SaaS projects
const EXECUTION_SKILLS = [
  'api',
  'architecture',
  'backend',
  'bug-fix',
  'code-review',
  'database',
  'debugging',
  'deployment',
  'docker',
  'documentation',
  'feature-development',
  'frontend',
  'git',
  'planning',
  'prd-analysis',
  'security',
  'strategic-research',
  'testing',
  'uiux',
  'verification'
];

// Project-level runtime scripts
const PROJECT_SCRIPTS = [
  'task-graph.js',
  'status-manager.js',
  'validate-project.js',
  'worktree-manager.js',
  'git-sync.js',
  'model-router.js',
  'maintenance-runner.js',
  'telemetry-report.js',
  'update-context-manifest.js'
];

function stampDNA(targetDir, options = {}) {
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  const resolvedTarget = path.resolve(targetDir);
  const projectName = options.projectName || path.basename(resolvedTarget);
  const projectId = options.projectId || projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const now = new Date().toISOString();

  // Create required directory structure in target project
  const dirs = [
    path.join(resolvedTarget, '.ai'),
    path.join(resolvedTarget, '.ai', 'context'),
    path.join(resolvedTarget, '.ai', 'state'),
    path.join(resolvedTarget, '.ai', 'research'),
    path.join(resolvedTarget, '.ai', 'improvements'),
    path.join(resolvedTarget, '.ai', 'agents'),
    path.join(resolvedTarget, '.ai', 'orchestration'),
    path.join(resolvedTarget, '.ai', 'scripts'),
    path.join(resolvedTarget, '.ai', 'skills'),
    path.join(resolvedTarget, '.agents'),
    path.join(resolvedTarget, '.agents', 'rules'),
    path.join(resolvedTarget, '.agents', 'skills')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Build replacement dictionary
  const replacements = {
    '{{PROJECT_NAME}}': projectName,
    '{{PROJECT_ID}}': projectId,
    '{{PROJECT_DESCRIPTION}}': options.description || `${projectName} application`,
    '{{PROJECT_DOMAIN}}': options.domain || 'General SaaS Application',
    '{{PROJECT_MODE}}': options.mode || 'Onboarded',
    '{{TECH_STACK_SUMMARY}}': options.techStackSummary || `${options.framework || 'Node.js'} / ${options.language || 'TypeScript'} / ${options.styling || 'CSS'}`,
    '{{FRAMEWORK}}': options.framework || 'Node.js',
    '{{LANGUAGE}}': options.language || 'TypeScript',
    '{{STYLING}}': options.styling || 'Tailwind CSS',
    '{{DATABASE}}': options.database || 'MongoDB',
    '{{ORM}}': options.orm || 'Mongoose',
    '{{API_PATTERN}}': options.apiPattern || 'REST / Next.js Server Handlers',
    '{{PACKAGE_MANAGER}}': options.packageManager || 'npm',
    '{{DEV_COMMAND}}': options.devCommand || 'npm run dev',
    '{{BUILD_COMMAND}}': options.buildCommand || 'npm run build',
    '{{TEST_COMMAND}}': options.testCommand || 'npm test',
    '{{LINT_COMMAND}}': options.lintCommand || 'npm run lint',
    '{{DEV_PORT}}': options.devPort || '3000',
    '{{CREATED_AT}}': options.createdAt || now,
    '{{LAST_UPDATED}}': now,
    '{{ARCHITECTURE_STYLE}}': options.architectureStyle || 'Modular Decoupled Component Architecture',
    '{{DEPLOYMENT_MODEL}}': options.deploymentModel || 'Containerized / Cloud Host (Vercel, Docker)',
    '{{COMPONENT_BOUNDARIES}}': options.componentBoundaries || '- `src/components/` or `app/components/`: Reusable presentation UI\n- `src/lib/` or `app/api/`: Domain business logic and services\n- `models/`: Database schemas and persistence entities',
    '{{CLIENT_STATE_PATTERN}}': options.clientStatePattern || 'React State / Context API / URL query params',
    '{{SERVER_COMMUNICATION_PATTERN}}': options.serverCommunicationPattern || 'Async fetch / React Server Actions / REST endpoints',
    '{{PERSISTENCE_PATTERN}}': options.persistencePattern || `${options.database || 'MongoDB'} managed via ${options.orm || 'Mongoose'}`,
    '{{API_BASE_PATHS}}': options.apiBasePaths || '/api/*',
    '{{AUTH_STRATEGY}}': options.authStrategy || 'Session / Token-based auth',
    '{{COMPONENT_NAMING}}': options.componentNaming || 'PascalCase.tsx',
    '{{TOTAL_FILES}}': options.fileCount || 0,
    '{{TOTAL_LOC}}': options.totalLoc || 0,
    '{{MODULES_LIST}}': JSON.stringify(options.modules || ['core', 'ui', 'api']),
    '{{PENDING_IMPROVEMENTS_COUNT}}': options.pendingImprovementsCount || 0,
    '{{DIRECTORY_STRUCTURE}}': options.directoryStructure || 'src/\n├── components/\n├── pages/ or app/\n└── lib/'
  };

  function interpolate(content) {
    let result = content;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.split(key).join(value);
    }
    return result;
  }

  const generatedFiles = [];

  // 1. Root AGENTS.md
  const agentsPath = path.join(resolvedTarget, 'AGENTS.md');
  const agentsTmpl = path.join(TEMPLATES_DIR, 'AGENTS.md.template');
  if (fs.existsSync(agentsTmpl) && (!fs.existsSync(agentsPath) || options.force)) {
    fs.writeFileSync(agentsPath, interpolate(fs.readFileSync(agentsTmpl, 'utf8')), 'utf8');
    generatedFiles.push('AGENTS.md');
  }

  // 2. Root GEMINI.md
  const geminiPath = path.join(resolvedTarget, 'GEMINI.md');
  const geminiTmpl = path.join(TEMPLATES_DIR, 'GEMINI.md.template');
  if (fs.existsSync(geminiTmpl) && (!fs.existsSync(geminiPath) || options.force)) {
    fs.writeFileSync(geminiPath, interpolate(fs.readFileSync(geminiTmpl, 'utf8')), 'utf8');
    generatedFiles.push('GEMINI.md');
  }

  // 3. .ai/settings.json
  const settingsPath = path.join(resolvedTarget, '.ai', 'settings.json');
  const settingsTmpl = path.join(TEMPLATES_DIR, 'settings.json.template');
  if (fs.existsSync(settingsTmpl) && (!fs.existsSync(settingsPath) || options.force)) {
    fs.writeFileSync(settingsPath, interpolate(fs.readFileSync(settingsTmpl, 'utf8')), 'utf8');
    generatedFiles.push('.ai/settings.json');
  }

  // 4. .ai/context/architecture.md (Project-specific architecture overview)
  const archPath = path.join(resolvedTarget, '.ai', 'context', 'architecture.md');
  const archTmpl = path.join(TEMPLATES_DIR, 'context-architecture.md.template');
  if (fs.existsSync(archTmpl) && (!fs.existsSync(archPath) || options.force)) {
    fs.writeFileSync(archPath, interpolate(fs.readFileSync(archTmpl, 'utf8')), 'utf8');
    generatedFiles.push('.ai/context/architecture.md');
  }

  // 5. Complete, authoritative context files from Factory
  // Deep-copies coding-rules.md (155 lines), ui-guidelines.md (195 lines),
  // architecture-rules.md (142 lines), naming-rules.md, and tech-stack.md
  // Ensures target projects receive 100% of the factory's quality rules.
  const coreContextFiles = [
    'coding-rules.md',
    'ui-guidelines.md',
    'architecture-rules.md',
    'naming-rules.md',
    'tech-stack.md'
  ];
  for (const cFile of coreContextFiles) {
    const srcCFile = path.join(FACTORY_ROOT, '.ai', 'context', cFile);
    const destCFile = path.join(resolvedTarget, '.ai', 'context', cFile);
    if (fs.existsSync(srcCFile) && (!fs.existsSync(destCFile) || options.force)) {
      fs.copyFileSync(srcCFile, destCFile);
      generatedFiles.push(`.ai/context/${cFile}`);
    }
  }

  // 7. .ai/state/project.json
  const projectPath = path.join(resolvedTarget, '.ai', 'state', 'project.json');
  const projectTmpl = path.join(TEMPLATES_DIR, 'project.json.template');
  if (fs.existsSync(projectTmpl) && (!fs.existsSync(projectPath) || options.force)) {
    fs.writeFileSync(projectPath, interpolate(fs.readFileSync(projectTmpl, 'utf8')), 'utf8');
    generatedFiles.push('.ai/state/project.json');
  }

  // 8. Initial decisions.json
  const decisionsPath = path.join(resolvedTarget, '.ai', 'state', 'decisions.json');
  if (!fs.existsSync(decisionsPath)) {
    fs.writeFileSync(decisionsPath, JSON.stringify([
      {
        id: "DEC-001",
        title: "Engineering DNA Embedded",
        status: "ACCEPTED",
        decision: `Initialized standalone engineering DNA into ${projectName}`,
        timestamp: now
      }
    ], null, 2), 'utf8');
    generatedFiles.push('.ai/state/decisions.json');
  }

  // 8.1 Initial tasks.json (Task DAG)
  const tasksPath = path.join(resolvedTarget, '.ai', 'state', 'tasks.json');
  if (!fs.existsSync(tasksPath)) {
    fs.writeFileSync(tasksPath, JSON.stringify({
      version: "2.0",
      project: projectName,
      description: `Task dependency graph (DAG) for ${projectName}`,
      tasks: []
    }, null, 2), 'utf8');
    generatedFiles.push('.ai/state/tasks.json');
  }

  // 8.2 Templates (strategic-research-template.md)
  const targetTemplatesDir = path.join(resolvedTarget, '.ai', 'templates');
  if (!fs.existsSync(targetTemplatesDir)) {
    fs.mkdirSync(targetTemplatesDir, { recursive: true });
  }
  const srcResearchTmpl = path.join(TEMPLATES_DIR, '..', 'strategic-research-template.md');
  const destResearchTmpl = path.join(targetTemplatesDir, 'strategic-research-template.md');
  if (fs.existsSync(srcResearchTmpl) && !fs.existsSync(destResearchTmpl)) {
    fs.copyFileSync(srcResearchTmpl, destResearchTmpl);
    generatedFiles.push('.ai/templates/strategic-research-template.md');
  }

  // 9. Execution Skills (.ai/skills/ and .agents/skills/)
  for (const skill of EXECUTION_SKILLS) {
    const srcSkillDir = path.join(FACTORY_ROOT, '.ai', 'skills', skill);
    const destSkillDir = path.join(resolvedTarget, '.ai', 'skills', skill);
    if (fs.existsSync(srcSkillDir)) {
      fs.cpSync(srcSkillDir, destSkillDir, { recursive: true });
      generatedFiles.push(`.ai/skills/${skill}`);

      // Create .agents/skills adapter
      const adapterDir = path.join(resolvedTarget, '.agents', 'skills', skill);
      if (!fs.existsSync(adapterDir)) {
        fs.mkdirSync(adapterDir, { recursive: true });
      }
      const adapterSkillFile = path.join(adapterDir, 'SKILL.md');
      const adapterContent = `---
name: ${skill}
description: See canonical skill at .ai/skills/${skill}/SKILL.md
---
See the full skill at ../../.ai/skills/${skill}/SKILL.md and follow it.
`;
      fs.writeFileSync(adapterSkillFile, adapterContent, 'utf8');
      generatedFiles.push(`.agents/skills/${skill}/SKILL.md`);
    }
  }

  // 10. Rules (.agents/rules/)
  const ruleTemplates = [
    { name: 'architecture-rules.md', target: '../.ai/context/architecture.md and ../.ai/context/architecture-rules.md' },
    { name: 'coding-rules.md', target: '../.ai/context/coding-rules.md' },
    { name: 'naming-rules.md', target: '../.ai/context/naming-rules.md' },
    { name: 'tech-stack.md', target: '../.ai/context/tech-stack.md' },
    { name: 'ui-guidelines.md', target: '../.ai/context/ui-guidelines.md' }
  ];

  for (const rule of ruleTemplates) {
    const rulePath = path.join(resolvedTarget, '.agents', 'rules', rule.name);
    if (!fs.existsSync(rulePath) || options.force) {
      const content = `# ${rule.name.replace('.md', '')} Rules\nFollow the conventions and guidelines specified in ${rule.target}.\n`;
      fs.writeFileSync(rulePath, content, 'utf8');
      generatedFiles.push(`.agents/rules/${rule.name}`);
    }
  }

  // Quality Invariants rule (Zero-Silly-Bugs Standard)
  const qualityRulePath = path.join(resolvedTarget, '.agents', 'rules', 'quality-invariants.md');
  if (!fs.existsSync(qualityRulePath) || options.force) {
    const qualityContent = `# Universal Quality Invariants (Zero-Silly-Bugs Standard)

1. **The "Common Sense" Sanity Invariant**:
   - Before outputting code, verify: Would a competent human deliver this?
   - Never produce invisible/unreadable UI (unpaired text and background colors, broken dark mode, overlapping text).
   - Never produce inaccurate logic or math (floating-point money errors, off-by-one errors).
   - Never write code with obvious runtime crashes (undefined property access, broken imports).

2. **Preserve Working Functionality (Zero Regressions)**:
   - Never break existing working features when adding or refactoring code.
   - Always inspect surrounding code and styles before modifying components or endpoints.

3. **Defensive Engineering by Default**:
   - Always handle the 3 fundamental states: Loading, Empty, and Error.
   - Never assume API data always exists; guard with safe checks (\`data?.items ?? []\`).
   - Validate inputs at system boundaries (forms, API payloads, route params).

4. **Self-Review Before Declaring Done**:
   - Mentally walk through the execution path from the user's perspective.
   - Verify that all changes compile, types are sound, and tests/build checks pass.
`;
    fs.writeFileSync(qualityRulePath, qualityContent, 'utf8');
    generatedFiles.push('.agents/rules/quality-invariants.md');
  }

  // 11. Agent Personas (.ai/agents/)
  const agentsSrcDir = path.join(FACTORY_ROOT, '.ai', 'agents');
  const agentsDestDir = path.join(resolvedTarget, '.ai', 'agents');
  if (fs.existsSync(agentsSrcDir)) {
    fs.cpSync(agentsSrcDir, agentsDestDir, { recursive: true });
    generatedFiles.push('.ai/agents/');
  }

  // 12. Orchestration & Worktree policies (.ai/orchestration/)
  const orchSrcDir = path.join(FACTORY_ROOT, '.ai', 'orchestration');
  const orchDestDir = path.join(resolvedTarget, '.ai', 'orchestration');
  if (fs.existsSync(orchSrcDir)) {
    fs.cpSync(orchSrcDir, orchDestDir, { recursive: true });
    generatedFiles.push('.ai/orchestration/');
  }

  // 13. Project Runtime Scripts (.ai/scripts/)
  for (const script of PROJECT_SCRIPTS) {
    const srcScript = path.join(FACTORY_ROOT, '.ai', 'scripts', script);
    const destScript = path.join(resolvedTarget, '.ai', 'scripts', script);
    if (fs.existsSync(srcScript)) {
      fs.copyFileSync(srcScript, destScript);
      generatedFiles.push(`.ai/scripts/${script}`);
    }
  }

  return {
    success: true,
    targetDir: resolvedTarget,
    generatedFiles
  };
}

// CLI Execution Support
if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node dna-stamper.js <targetDirectory> [--config <jsonFile>] [--force]');
    process.exit(1);
  }

  let options = {};
  const configIdx = process.argv.indexOf('--config');
  if (configIdx !== -1 && process.argv[configIdx + 1]) {
    try {
      options = JSON.parse(fs.readFileSync(process.argv[configIdx + 1], 'utf8'));
    } catch (e) {
      console.warn(`Could not read config file: ${e.message}`);
    }
  }

  if (process.argv.includes('--force')) {
    options.force = true;
  }

  try {
    const res = stampDNA(target, options);
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(`Stamping error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { stampDNA };
