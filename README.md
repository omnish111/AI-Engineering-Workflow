# AI Engineering Workflow (AEW)

Welcome to the **AI Engineering Workflow (AEW)** — an adaptive, multi-agent software engineering system. It uses cooperative AI agents with dynamic orchestration to transform Product Requirements Documents (PRDs) into fully working, tested, and reviewed SaaS applications.

## Architecture Version

**V2 Tier-B** — Enterprise automation, observability, golden evals, dynamic model routing, worktree lifecycle isolation, and multi-project support.

See the architecture documentation:
- [docs/v2-tier-b-architecture.md](docs/v2-tier-b-architecture.md) — Full Tier-B Enterprise Architecture
- [docs/v2-tier-a-architecture.md](docs/v2-tier-a-architecture.md) — Tier-A Adaptive Core Architecture

## Repository Structure

```
AI Engineering Workflow/
├── AGENTS.md            ← Shared rules & V2 orchestration model
├── CLAUDE.md            ← Claude Code adapter
├── GEMINI.md            ← Google Antigravity adapter
├── README.md            ← This human entry point
│
├── .ai/                 ← Canonical AI Agent configuration
│   ├── settings.json    ← Global tech stack and directory config
│   ├── agents/          ← Agent definitions (orchestrator.md + V1 agents)
│   ├── skills/          ← Skills-first architecture (20 modular SKILL.md)
│   ├── orchestration/   ← V2 orchestration policies
│   │   ├── role-registry.json       ← Role registry and forbidden role rules
│   │   ├── context-manifest.json    ← Compiled context routing manifest
│   │   ├── context-overrides.json   ← Manual context overrides (preserved)
│   │   ├── context-discovery.json   ← Auto-discovered codebase inventory
│   │   ├── worktree-policy.md       ← Worktree lifecycle & safety rules
│   │   ├── maintenance-specs.json   ← Scheduled maintenance routine specs
│   │   ├── model-routing.json       ← Cost/latency abstract model tiers
│   │   ├── decision-policy.json     ← Ask-vs-Act confidence rules
│   │   ├── checkpoint-policy.json   ← Human checkpoint triggers
│   │   ├── verification-schema.json ← Evidence-based quality gates
│   │   └── parallel-policy.md       ← Parallel task safety guidelines
│   ├── state/           ← Single authoritative source of truth
│   │   ├── project.json   ← Project metadata and tech stack
│   │   ├── tasks.json     ← Task DAG nodes, worktree mappings, retry history
│   │   ├── agents.json    ← Agent pool and operational states
│   │   ├── decisions.json ← Inferred and human decisions
│   │   ├── blockers.json  ← Active and resolved blockers
│   │   └── events.jsonl   ← State transition event log
│   ├── telemetry/       ← Engineering telemetry (zero secrets)
│   │   ├── events.jsonl         ← Sanitized event stream
│   │   └── daily-summary.json   ← Aggregated operational metrics
│   ├── maintenance/     ← Scheduled maintenance logs
│   │   └── reports/             ← Auditable maintenance run reports
│   ├── projects/        ← Multi-project isolation
│   │   ├── registry.json        ← Project registry & active pointer
│   │   └── <project-id>/state/  ← Isolated project state stores
│   ├── context/         ← Development rules and conventions
│   ├── templates/       ← PRD, bug, feature, and code templates
│   ├── project-management/ ← Markdown dashboards (synced from JSON state)
│   ├── scripts/         ← Deterministic CLI tools
│   │   ├── task-graph.js              ← Task DAG validator & manager
│   │   ├── status-manager.js          ← B1: Schema validation & health diagnostics
│   │   ├── update-context-manifest.js ← B2: Context discovery & safe sync
│   │   ├── worktree-manager.js        ← B3: Git worktree lifecycle automation
│   │   ├── maintenance-runner.js      ← B4: Scheduled maintenance automation
│   │   ├── telemetry-report.js        ← B5: Engineering telemetry & efficiency
│   │   ├── eval-runner.js             ← B6: Golden-task benchmark runner
│   │   ├── model-router.js            ← B7: Cost/latency model tier router
│   │   ├── project-manager.js         ← B8: Multi-project isolation manager
│   │   ├── validate-project.js        ← Codebase compliance auditor
│   │   └── scaffold-starter.js        ← Project scaffolding
│   └── archive/         ← Archived V1 agents and workflows
│
├── evals/               ← Benchmark evaluation suite
│   └── golden-tasks/    ← 10 Standardized golden tasks (GT-01 to GT-10)
├── .worktrees/          ← Isolated Git worktrees for parallel execution
├── .agents/             ← Google Antigravity adapter (skills, rules, workflows)
├── .claude/             ← Claude Code adapter
├── .cursor/             ← Cursor adapter
│
├── doc/                 ← Product requirements, bugs, features
├── docs/                ← Architecture documentation
└── codebase/            ← Generated applications
    ├── backend/         ← NestJS 11 backend
    └── frontend/        ← Next.js 14 frontend
```

## How to Get Started

1. Complete your PRD at **[doc/prd.md](doc/prd.md)**.
2. Message the AI agent:
   > *"I have completed my PRD. Please ingest doc/prd.md and start code generation."*

### V2 Core Capabilities

| Aspect | Description |
|--------|-------------|
| **Dynamic Orchestration** | Only activated roles participate; no redundant agents |
| **Context Routing** | Token-budgeted context loading; no context dump |
| **Task DAG** | Dependency graph execution with parallel capability |
| **Ask vs Act** | Infers decisions with confidence; checkpoints when ambiguous |
| **Deterministic State** | JSON/JSONL single source of truth with strict validation |
| **Worktree Isolation** | Parallel tasks run in isolated Git worktrees |
| **Model Routing** | Optimal cost/reasoning tiers (`fast`, `standard`, `strong`, `critical`) |
| **Telemetry & Hygiene** | Sanitized event logging, daily/weekly health audits |
| **Multi-Project** | Isolated state per project without polluting main workspace |

---

## ⚙️ Developer CLI Commands

### State & Task Graph Management
```bash
# Validate task DAG dependencies and status
node .ai/scripts/task-graph.js validate
node .ai/scripts/task-graph.js status

# Schema validation, stale detection, and system health
node .ai/scripts/status-manager.js validate
node .ai/scripts/status-manager.js check-stale
node .ai/scripts/status-manager.js health
node .ai/scripts/status-manager.js sync
```

### Context Manifest Maintenance
```bash
# Auto-discover modules, diff against manifest, and compile
node .ai/scripts/update-context-manifest.js discover
node .ai/scripts/update-context-manifest.js diff
node .ai/scripts/update-context-manifest.js validate
node .ai/scripts/update-context-manifest.js apply
```

### Git Worktree Lifecycle
```bash
# Create, inspect, reconcile, and clean up isolated worktrees
node .ai/scripts/worktree-manager.js create <taskId> [branchName]
node .ai/scripts/worktree-manager.js status
node .ai/scripts/worktree-manager.js reconcile
node .ai/scripts/worktree-manager.js cleanup <taskId>
```

### Scheduled Maintenance
```bash
# Execute automated maintenance routines
node .ai/scripts/maintenance-runner.js daily
node .ai/scripts/maintenance-runner.js weekly
node .ai/scripts/maintenance-runner.js monthly
```

### Engineering Telemetry
```bash
# Inspect sanitized telemetry and operational efficiency
node .ai/scripts/telemetry-report.js summary
node .ai/scripts/telemetry-report.js daily
node .ai/scripts/telemetry-report.js efficiency
node .ai/scripts/telemetry-report.js task <taskId>
node .ai/scripts/telemetry-report.js failure
```

### Golden-Task Evaluations & Model Routing
```bash
# Run benchmark golden tasks (GT-01 to GT-10)
node .ai/scripts/eval-runner.js run
node .ai/scripts/eval-runner.js list

# Inspect model tier routing decisions
node .ai/scripts/model-router.js tiers
node .ai/scripts/model-router.js route <taskType> [--priority] [--retries] [--security]
```

### Multi-Project Isolation
```bash
# Manage isolated project workspaces
node .ai/scripts/project-manager.js list
node .ai/scripts/project-manager.js create <id> <name> [techStack]
node .ai/scripts/project-manager.js switch <id>
node .ai/scripts/project-manager.js status
```

### Test & Regression Suites
```bash
# Tier-B verification suites
node .ai/scripts/v2-tier-b-wave1-test.js        # Wave 1 verification (18 checks)
node .ai/scripts/v2-tier-b-wave2-test.js        # Wave 2 verification (22 checks)
node .ai/scripts/v2-tier-b-regression-suite.js # 12-scenario real-world regression

# Core regression suite
node .ai/scripts/v2-dry-run.js                 # 67 architectural checks
node --experimental-strip-types --test codebase/backend/test/*.test.js
```

---

## 🐛 Fixing Bugs

1. Create a bug report: **`doc/bugs/[bug-name].md`** (template at `.ai/templates/bug-template.md`).
2. Message: *"I have created a bug report at doc/bugs/[bug-name].md. Please investigate and fix."*

## 🚀 Adding Features

1. Create a feature spec: **`doc/features/[feature-name].md`** (template at `.ai/templates/feature-template.md`).
2. Message: *"I have added a feature request at doc/features/[feature-name].md. Please analyze and implement."*
