# V2 Tier-B Architecture Documentation

## Overview

The **AI Engineering Workflow V2 Tier-B** extends the validated Tier-A architecture with enterprise-grade automation, maintainability, engineering observability, golden-task evaluations, dynamic model routing, multi-project isolation, and worktree lifecycle management.

Tier-B preserves all core Tier-A principles:
- **Minimum unnecessary human interaction** (ask only when genuinely ambiguous)
- **Minimum token bloat** (strict context routing and boundary limits)
- **Minimum unnecessary model calls** (task DAG and targeted role activation)
- **Safe parallelism** (worktree isolation and output-path collision guards)
- **Deterministic state** (strict schema validation and non-destructive reconciliation)

---

## Tier-B System Architecture Map

```
AI Engineering Workflow/
├── .ai/
│   ├── state/                     ← Canonical Single Source of Truth
│   │   ├── project.json           ← Project metadata and tech stack
│   │   ├── tasks.json             ← Task DAG nodes, worktree mappings, retry history
│   │   ├── agents.json            ← Agent pool and role status
│   │   ├── decisions.json         ← Inferred and human-checkpointed decisions
│   │   ├── blockers.json          ← Escalated blockers and resolution status
│   │   └── events.jsonl           ← State transition event stream
│   ├── orchestration/
│   │   ├── role-registry.json     ← Role capabilities and forbidden lists
│   │   ├── context-manifest.json  ← Compiled context boundaries per task type
│   │   ├── context-overrides.json ← Manual overrides preserved during discovery
│   │   ├── context-discovery.json ← Discovered inventory of skills and modules
│   │   ├── worktree-policy.md     ← Lifecycle rules and deletion safeguards
│   │   ├── maintenance-specs.json ← Scheduled maintenance routine definitions
│   │   ├── model-routing.json     ← Abstract model tiers and escalation rules
│   │   └── verification-schema.json ← Evidence-based verification gates
│   ├── telemetry/
│   │   ├── events.jsonl           ← Sanitized telemetry event log (zero secrets)
│   │   └── daily-summary.json     ← Aggregated operational metrics
│   ├── maintenance/
│   │   └── reports/               ← Auditable maintenance run logs
│   ├── projects/
│   │   ├── registry.json          ← Registered projects and active pointer
│   │   └── <project-id>/state/    ← Isolated project state stores
│   ├── scripts/                   ← Deterministic Node.js CLI Tools
│   │   ├── status-manager.js      ← B1: Schema validation & health diagnostics
│   │   ├── update-context-manifest.js ← B2: Context discovery & safe sync
│   │   ├── worktree-manager.js    ← B3: Git worktree lifecycle automation
│   │   ├── maintenance-runner.js  ← B4: Scheduled maintenance automation
│   │   ├── telemetry-report.js    ← B5: Engineering telemetry & efficiency
│   │   ├── eval-runner.js         ← B6: Golden-task benchmark runner
│   │   ├── model-router.js        ← B7: Cost/latency model tier router
│   │   └── project-manager.js     ← B8: Multi-project isolation manager
│   └── skills/                    ← 20 Modular execution skills
├── evals/
│   └── golden-tasks/              ← B6: 10 Standardized benchmark tasks (GT-01 to GT-10)
└── .worktrees/                    ← B3: Isolated Git worktrees for parallel execution
```

---

## B1: Enhanced State & Status Manager

The state manager (`.ai/scripts/status-manager.js`) guarantees state integrity across all five primary JSON entities and the event log.

### Schema Validation & Type Enforcement
All state mutations are validated against strict JSON schemas:
- **`project.json`**: Required fields `id`, `name`, `version`, `status`, `techStack`, `architecture`. Status must be one of `INIT`, `PLANNING`, `READY_FOR_DEV`, `IN_DEV`, `REVIEW`, `DEPLOYED`, `PAUSED`.
- **`tasks.json`**: Array of task nodes containing `id`, `name`, `type`, `status`, `assignedRoles`, `dependencies`, `outputFiles`, `verification`. Task status must strictly follow the state machine: `BLOCKED` → `READY` → `IN_PROGRESS` → `VERIFYING` → `COMPLETED` / `FAILED`.
- **`agents.json`**: Role registry and operational states (`IDLE`, `ACTIVE`, `WAITING_FOR_HUMAN`, `ERROR`).
- **`decisions.json`**: Array containing `id`, `task`, `type`, `description`, `source` (`INFERRED` or `HUMAN`), `confidence`, `timestamp`.
- **`blockers.json`**: Array containing `id`, `taskId`, `description`, `status` (`ACTIVE` or `RESOLVED`), `escalatedToHuman`.

### Stale-State & Corruption Detection
- **Stale Detection**: Detects tasks stalled in `IN_PROGRESS` or `VERIFYING` state past configurable thresholds (default: 24h).
- **Corruption Detection**: Validates JSON syntax, schema compliance, missing dependency pointers, and dangling role assignments.
- **Health Diagnostic**: Comprehensive CLI command checking overall factory readiness.

### CLI Commands
```bash
node .ai/scripts/status-manager.js validate     # Validate schema and state machine transitions
node .ai/scripts/status-manager.js check-stale  # Identify stalled tasks and active blockers
node .ai/scripts/status-manager.js health       # Run complete system diagnostic
node .ai/scripts/status-manager.js sync         # Synchronize JSON state into markdown dashboards
```

---

## B2: Automatic Context-Manifest Maintenance

The context maintenance system (`.ai/scripts/update-context-manifest.js`) prevents context manifest drift as new source files, skills, or rules are added to the repository.

### Safe Auto-Discovery Algorithm
1. **Discover**: Scans `.ai/skills/`, `.ai/context/`, `codebase/`, and `evals/` to build `.ai/orchestration/context-discovery.json`.
2. **Diff**: Compares discovered modules against the current compiled `.ai/orchestration/context-manifest.json`.
3. **Preserve Overrides**: Merges entries while strictly respecting manual context groups defined in `.ai/orchestration/context-overrides.json`.
4. **Enforce Context Boundaries**: Verifies that no task type exceeds token budgets (maximum allowed files).

### CLI Commands
```bash
node .ai/scripts/update-context-manifest.js discover  # Scan codebase and write discovery inventory
node .ai/scripts/update-context-manifest.js diff      # Show differences between discovery and manifest
node .ai/scripts/update-context-manifest.js validate  # Validate all file paths in manifest exist
node .ai/scripts/update-context-manifest.js apply     # Compile discovery + overrides into manifest
```

---

## B3: Worktree Lifecycle Automation

The worktree manager (`.ai/scripts/worktree-manager.js`) enables safe, isolated task execution in parallel Git worktrees rooted at `.worktrees/<taskId>`.

### Non-Destructive Safety Rules
1. **Never Remove Dirty Worktrees**: Refuses to remove worktrees containing uncommitted modifications or untracked files unless an explicit force flag is given.
2. **Never Remove Unmerged Work**: Protects branches that have unmerged commits.
3. **State Tracking**: Automatically maps worktree directory paths and branch names into the corresponding task node in `.ai/state/tasks.json`.
4. **Crash Recovery**: If an agent process terminates abruptly, worktree state remains attached to the task, allowing seamless resumption.

### CLI Commands
```bash
node .ai/scripts/worktree-manager.js create <taskId> [branchName] # Create worktree for task
node .ai/scripts/worktree-manager.js status                      # List all worktrees and dirty status
node .ai/scripts/worktree-manager.js reconcile                   # Reconcile Git worktrees with tasks.json
node .ai/scripts/worktree-manager.js cleanup <taskId>            # Safely remove a clean worktree
```

---

## B4: Scheduled Maintenance Automation

The maintenance runner (`.ai/scripts/maintenance-runner.js`) executes automated hygiene routines defined in `.ai/orchestration/maintenance-specs.json`.

### Cadences & Routines
- **Daily**:
  - Blocker inspection and escalation review.
  - Stale task detection (>24h).
  - State schema and transition consistency verification.
- **Weekly**:
  - Context manifest path validation (dead link detection).
  - Orphaned / detached Git worktree audit.
  - Test suite baseline verification (`node --test`).
- **Monthly**:
  - Telemetry aggregation and token efficiency audit.
  - Archived files cleanup.
  - Dependency vulnerability scan.

### Report Generation
Every maintenance run generates an auditable JSON report under `.ai/maintenance/reports/maintenance-<cadence>-<timestamp>.json`.

### CLI Commands
```bash
node .ai/scripts/maintenance-runner.js daily     # Run daily factory health inspection
node .ai/scripts/maintenance-runner.js weekly    # Run weekly context and worktree audit
node .ai/scripts/maintenance-runner.js monthly   # Run monthly telemetry and cleanup routine
node .ai/scripts/maintenance-runner.js list      # List all available maintenance cadences
```

---

## B5: Engineering Telemetry

The telemetry engine (`.ai/scripts/telemetry-report.js`) tracks agent token usage, execution durations, retry counts, and failure modes to enable data-driven optimization.

### Zero-Secrets Sanitization Policy
All events emitted into `.ai/telemetry/events.jsonl` pass through a strict regex-based redactor that replaces API keys, JWTs, bearer tokens, passwords, secrets, and private keys with `[REDACTED]`.

### Reporting Views
- **Summary**: Overall event count, active tasks, error rates, and total duration.
- **Daily**: Day-by-day task completions, token consumption, and failure rates.
- **Task**: Deep-dive into specific task lifecycle, retries, and role assignments.
- **Failure**: Aggregated breakdown of root causes and blocked states.
- **Efficiency**: Token usage per completed task and model tier distribution.

### CLI Commands
```bash
node .ai/scripts/telemetry-report.js summary     # Overall telemetry summary
node .ai/scripts/telemetry-report.js daily       # Daily performance and cost metrics
node .ai/scripts/telemetry-report.js task <id>   # Detailed audit trail for specific task
node .ai/scripts/telemetry-report.js failure     # Failure analysis report
node .ai/scripts/telemetry-report.js efficiency  # Efficiency and model tier utilization
```

---

## B6: Golden-Task Evaluation Suite

The evaluation suite (`.ai/scripts/eval-runner.js`) maintains a standardized benchmark of 10 golden tasks in `evals/golden-tasks/` to evaluate factory behavior against regressions.

### Benchmark Tasks
1. **GT-01**: Simple Frontend Change (button styling, 2 roles, 5 files max).
2. **GT-02**: Backend CRUD Endpoint (REST endpoint, 4 roles, 8 files max).
3. **GT-03**: Authentication & Password Reset (security tokens, 4 roles, 8 files max).
4. **GT-04**: Runtime Bug Fix (reproduction, debugger role, 10 files max).
5. **GT-05**: Security-Sensitive Feature (RBAC / hashing, reviewer role, 10 files max).
6. **GT-06**: Database Schema Change (TypeORM entity, migration test, 7 files max).
7. **GT-07**: Independent Parallel Work (non-conflicting files, worktree isolation).
8. **GT-08**: Ambiguous Requirement Handling (human checkpoint triggered).
9. **GT-09**: Interrupted Workflow Resume (recovery from partial progress).
10. **GT-10**: Deployment & Infrastructure Analysis (Docker / CI, 5 files max).

### Evaluation Criteria
- **Role Alignment**: Selected roles must exist in `role-registry.json`.
- **Role Avoidance**: Must never select roles forbidden for the task type.
- **Context Boundary**: Loaded context file count must strictly remain within threshold.
- **Verification Schema**: Must specify a recognized verification test strategy.

### CLI Commands
```bash
node .ai/scripts/eval-runner.js run [task-file]  # Run golden task evaluation
node .ai/scripts/eval-runner.js list             # List all benchmark tasks
```

---

## B7: Advanced Model Routing

The model router (`.ai/scripts/model-router.js`) maps tasks to abstract model tiers based on complexity, security sensitivity, and retry history to minimize inference costs while maintaining high quality.

### Abstract Model Tiers
| Tier | Profile | Typical Model Classes | Intended Task Types |
|------|---------|-----------------------|---------------------|
| **`fast`** | Low latency, low cost | Claude 3.5 Haiku, Gemini 1.5 Flash | Syntax checks, documentation, simple UI fixes, manifest updates |
| **`standard`** | Balanced reasoning & speed | Claude 3.5 Sonnet, Gemini 1.5 Pro | Backend CRUD, component development, unit test writing |
| **`strong`** | High reasoning capability | Claude 3.7 Sonnet (Thinking), GPT-4o | Architecture planning, debugging complex bugs, task DAG generation |
| **`critical`** | Maximum depth & verification | Opus / Specialized security evaluators | Security auditing, crypto/auth implementations, destructive operations |

### Adaptive Escalation
- Tasks starting in `standard` escalate to `strong` if they encounter execution failures or retries.
- High-risk tasks (auth, payments, permissions) automatically route to `critical`.
- Fallback paths are defined for every tier (e.g. `critical` → `strong` → `standard`).

### CLI Commands
```bash
node .ai/scripts/model-router.js route <taskType> [--priority] [--retries] [--security]
node .ai/scripts/model-router.js tiers
```

---

## B8: Multi-Project Support

The project manager (`.ai/scripts/project-manager.js`) provides complete state isolation for multi-project or multi-tenant workspaces.

### Registry & State Structure
- Global registry at `.ai/projects/registry.json` tracks active project and all registered project configurations.
- Each project maintains isolated state in `.ai/projects/<projectId>/state/`:
  - `project.json`
  - `tasks.json`
  - `agents.json`
  - `decisions.json`
  - `blockers.json`
  - `events.jsonl`
- Switching projects re-points active symlinks/pointers without polluting the default repository workspace.

### CLI Commands
```bash
node .ai/scripts/project-manager.js list         # List registered projects and active indicator
node .ai/scripts/project-manager.js create <id> <name> [techStack] # Create isolated project state
node .ai/scripts/project-manager.js switch <id>  # Switch active project context
node .ai/scripts/project-manager.js status       # Display active project details
```

---

## Verification & Test Suites

Tier-B is protected by automated verification suites guaranteeing 100% compliance:

1. **Wave 1 Test Suite** (`.ai/scripts/v2-tier-b-wave1-test.js`):
   - Scenarios A–G (corruption detection, stale detection, context discovery, override preservation, worktree isolation, dirty worktree protection, crash resumption).
   - **Result: 18 / 18 checks passed.**
2. **Wave 2 Test Suite** (`.ai/scripts/v2-tier-b-wave2-test.js`):
   - Tests B4 scheduled maintenance, B5 telemetry sanitization, B6 golden evaluations, B7 model routing, and B8 multi-project isolation.
   - **Result: 22 / 22 checks passed.**
3. **12-Scenario Real-World Regression Suite** (`.ai/scripts/v2-tier-b-regression-suite.js`):
   - Validates all 12 operational scenarios end-to-end under real conditions.
   - **Result: 12 / 12 scenarios passed.**
4. **Tier-A Regression Baseline**:
   - `task-graph.js validate`: 0 errors.
   - `validate-project.js`: 0 violations.
   - `v2-dry-run.js`: 67 / 67 passed.
   - Backend unit & e2e test suite: 20 / 20 passed.
