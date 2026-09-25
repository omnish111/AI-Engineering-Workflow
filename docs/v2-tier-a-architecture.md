# V2 Tier-A Architecture Documentation

## Overview

The AI Engineering Workflow V2 Tier-A is an adaptive, token-efficient, model-friendly AI software engineering system that replaces the V1 fixed-pipeline approach.

## V1 → V2 Migration Summary

### Old Architecture (V1)
- **Fixed pipeline**: PRD → Q&A (11 mandatory questions) → Plan → Backend → Frontend → QA → Review
- **All agents always active**: super-agent, deep-plan, backend, frontend, qa, code-review
- **Monolithic agent files**: 10-14KB each, always fully loaded
- **Markdown-primary state**: Human-readable but not machine-parseable
- **No context routing**: All 8+ context files loaded for every task
- **No parallel work**: Strict sequential agent execution
- **Trust-based verification**: Executors self-declared completion

### New Architecture (V2 Tier-A)
- **Dynamic orchestration**: Only required roles activated per task
- **Skills-first**: 20 modular skills with YAML frontmatter and triggers
- **Task DAG**: Dependency graph with parallel execution support
- **Intelligent Ask vs Act**: Infer when possible, ask only when genuinely ambiguous
- **Context routing**: Load only relevant context per task type
- **Machine-readable state**: JSON/JSONL source of truth
- **Evidence-based verification**: Structured proof required for completion

---

## A1. Skills-First Architecture

Skills are the primary reusable execution unit. Each skill lives in `.ai/skills/[name]/SKILL.md` with YAML frontmatter.

### Skill Structure
```yaml
---
name: backend
description: NestJS backend development conventions
triggers:
  - backend tasks or API development
  - NestJS module scaffolding
required_context:
  - .ai/context/coding-rules.md
  - .ai/context/architecture-rules.md
---
```

### Available Skills (20)
| Skill | Purpose |
|-------|---------|
| project-init | Project initialization and scaffolding |
| prd-analysis | PRD validation and feature extraction |
| planning | Task decomposition and DAG generation |
| architecture | System design and patterns |
| backend | NestJS backend development |
| frontend | Next.js frontend development |
| database | MongoDB/Redis data operations |
| testing | Impact-aware test selection and execution |
| security | Security auditing and secure coding |
| debugging | Error investigation and root cause analysis |
| deployment | CI/CD and release management |
| bug-fix | Bug investigation, reproduction, and fix |
| feature-development | Incremental feature addition |
| verification | Quality gates and acceptance criteria |
| api | RESTful API design and documentation |
| code-review | Code review for quality and security |
| docker | Containerization and Docker Compose |
| documentation | Technical documentation |
| git | Version control and branching |
| uiux | UI/UX design and accessibility |

### Antigravity Compatibility
`.agents/skills/[name]/SKILL.md` contains adapter stubs pointing to canonical `.ai/skills/[name]/SKILL.md`.

---

## A2. Dynamic Orchestration

The orchestrator classifies tasks and activates only the required roles.

### Roles
| Role | Description | Skills |
|------|------------|--------|
| orchestrator | Coordinates execution | project-init, prd-analysis |
| planner | Analyzes and decomposes | planning, prd-analysis, architecture |
| researcher | Investigates options | architecture, security, database |
| architect | Designs systems | architecture, database, api, security |
| implementer | Writes code | backend, frontend, database, api, docker |
| verifier | Validates changes | testing, verification, code-review |
| reviewer | Evaluates quality | code-review, security, architecture |
| debugger | Resolves errors | debugging, bug-fix, testing |
| deployer | Manages deployment | deployment, docker, git |

### Task Classification Examples
- **Simple UI fix** → implementer → verifier (2 roles)
- **Auth feature** → planner → architect → implementer → verifier → reviewer (5 roles)
- **Deployment issue** → debugger → deployer → verifier (3 roles)

---

## A3. Task DAG

Tasks are stored as a directed acyclic graph in `.ai/state/tasks.json`.

### Task Schema
```json
{
  "id": "TASK-001",
  "description": "Implement user authentication",
  "type": "backend",
  "role": "implementer",
  "priority": "P0",
  "complexity": "L",
  "dependsOn": [],
  "context": [".ai/skills/backend/SKILL.md"],
  "outputs": ["codebase/backend/modules/auth/**"],
  "acceptanceCriteria": ["POST /auth/register creates a user"],
  "verification": { "type": "test", "command": "npm test -- --grep auth" },
  "status": "PENDING",
  "retryPolicy": { "maxRetries": 3, "backoff": "exponential" }
}
```

### State Transitions
```
PENDING → READY → IN_PROGRESS → VERIFYING → COMPLETED
                                           → FAILED → RETRYING → IN_PROGRESS
                                                    → BLOCKED → HUMAN_REQUIRED
```

### CLI
```bash
node .ai/scripts/task-graph.js validate   # Validate DAG integrity
node .ai/scripts/task-graph.js ready      # List ready tasks
node .ai/scripts/task-graph.js parallel   # List parallelizable tasks
node .ai/scripts/task-graph.js status     # Summary
```

---

## A4. Intelligent Ask vs Act

Decision policy in `.ai/orchestration/decision-policy.json`:

| Category | Action | Examples |
|----------|--------|---------|
| Known | Act immediately | File naming, module structure |
| Inferable | Infer and act (log decision) | DB choice from data patterns in PRD |
| Researchable | Research first | Pagination strategy for specific query |
| Ambiguous/High-risk | Ask user | Git strategy, payment provider, credentials |

---

## A5. Context Router

Context manifest in `.ai/orchestration/context-manifest.json` maps task types to required context files.

| Task Type | Context Groups Loaded |
|-----------|----------------------|
| simple-fix | core, backend |
| bug-fix | core, bug-fix, state |
| feature | core, planning, backend, testing |
| complex-feature | core, planning, backend, frontend, database, security, testing |
| deployment | core, deployment |

---

## A6. Machine-Readable State

| File | Purpose | Format |
|------|---------|--------|
| `.ai/state/project.json` | Project metadata and status | JSON |
| `.ai/state/tasks.json` | Task dependency graph | JSON |
| `.ai/state/agents.json` | Active role tracking | JSON |
| `.ai/state/decisions.json` | Decision log | JSON |
| `.ai/state/blockers.json` | Blocker tracking | JSON |
| `.ai/state/events.jsonl` | Append-only event log | JSONL |

Markdown dashboards in `.ai/project-management/` are generated from state via `status-manager.js sync`.

---

## A7. Safe Parallel Work

Policy in `.ai/orchestration/parallel-policy.md`:
- **Isolated worktrees**: When tasks modify same files/module
- **Shared workspace**: When tasks modify independent modules
- **Conflict detection**: Check output file paths before parallel execution
- **Integration with Antigravity**: Use native worktree/subagent capabilities

---

## A8. Impact-Aware Testing

Enhanced testing skill determines test scope based on change impact:
1. What changed? → What modules affected? → What tests relevant?
2. Focused tests first → Affected integration tests → Full suite when needed

---

## A9. Planner/Executor/Verifier Separation

- **Planner**: Determines what should happen
- **Executor**: Performs changes
- **Verifier**: Proves changes are correct (with structured evidence)
- **Reviewer**: Evaluates architecture, quality, security

Verification schema in `.ai/orchestration/verification-schema.json` requires:
- Commands executed and results
- Tests run and pass/fail counts
- Changed files list
- Acceptance criteria status

---

## A10. Human Checkpoint Policy

Policy in `.ai/orchestration/checkpoint-policy.json`:

**Autonomous**: read files, edit source, format code, run tests, create docs, create branches, install deps.

**Ask user**: production deployment, credential changes, destructive database actions, breaking API changes, payment-critical changes, irreversible external actions.

---

## Compatibility Model

| Tool | Adapter | Mechanism |
|------|---------|-----------|
| Claude Code | `CLAUDE.md` → `AGENTS.md` | Skills via `.claude/skills/` |
| Google Antigravity | `GEMINI.md` → `AGENTS.md` | Skills via `.agents/skills/` (SKILL.md stubs) |
| Cursor | `AGENTS.md` | Rules via `.cursor/rules/` |

All adapter stubs point to canonical `.ai/skills/[name]/SKILL.md`.
