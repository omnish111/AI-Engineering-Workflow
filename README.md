# AI Engineering Workflow (AEW) — V3

Welcome to the **AI Engineering Workflow (AEW)** — an Antigravity-first, Skills-first AI engineering harness. AEW transforms Product Requirements Documents (PRDs) into production-ready, fully tested, and independently evaluated applications.

## Architecture Version

**V3 Antigravity-First** — Native Rules, 17 Canonical Agent Skills, 7 Custom Subagents, Deterministic Lifecycle Hooks, Abstract Capability-Tier Routing, Concurrency-Safe State, and Executable Outcome Evaluations.

See the architecture documentation:
- [docs/v3-antigravity-architecture.md](docs/v3-antigravity-architecture.md) — Canonical AEW V3 Antigravity-First Architecture
- [AGENTS.md](AGENTS.md) — Shared Engineering Constitution
- [GEMINI.md](GEMINI.md) — Native Antigravity Entry Point

---

## Repository Structure

```
AI Engineering Workflow/
├── AGENTS.md                  ← Canonical constitution: purpose, safety, autonomy, verification
├── GEMINI.md                  ← Native Antigravity entry point: rules, skills, agents, hooks
├── CLAUDE.md                  ← Minimal compatibility note
├── README.md                  ← Human-facing overview & developer reference
│
├── .agents/                   ← Antigravity Native Runtime Interface
│   ├── rules/                 ← Native rules with triggers & file scoping
│   │   ├── coding-rules.md        ← always_on: TypeScript strictness & defensive invariants
│   │   ├── security.md            ← always_on: Secret protection, input sanitization, authn/authz
│   │   ├── architecture-rules.md  ← model_decision: Layered boundaries & clean dependency flow
│   │   ├── naming-rules.md        ← model_decision: Kebab-case, PascalCase, conventions
│   │   ├── ui-guidelines.md       ← glob (*.{tsx,jsx,css}): States, contrast, responsive UI
│   │   ├── tech-stack.md          ← model_decision: Baseline technologies & version pins
│   │   └── project-context.md     ← model_decision: Factory harness vs product code isolation
│   ├── skills/                ← 17 Canonical Agent Skills (progressive disclosure)
│   │   ├── analyzing-prd/SKILL.md
│   │   ├── planning/SKILL.md
│   │   ├── researching/SKILL.md
│   │   ├── designing-architecture/SKILL.md
│   │   ├── implementing-backend/SKILL.md
│   │   ├── implementing-frontend/SKILL.md
│   │   ├── designing-database/SKILL.md
│   │   ├── designing-apis/SKILL.md
│   │   ├── securing-applications/SKILL.md
│   │   ├── testing-software/SKILL.md
│   │   ├── debugging-software/SKILL.md
│   │   ├── verifying-changes/SKILL.md
│   │   ├── evaluating-results/SKILL.md
│   │   ├── reviewing-code/SKILL.md
│   │   ├── deploying-software/SKILL.md
│   │   ├── onboarding-projects/SKILL.md
│   │   └── upgrading-projects/SKILL.md
│   ├── agents/                ← 7 Focused Antigravity Custom Subagents
│   │   ├── planner.md             ← Requirements decomposition & DAG generation
│   │   ├── researcher.md          ← Targeted technical & API investigations
│   │   ├── implementer.md         ← Production code authoring
│   │   ├── verifier.md            ← Build, lint, typecheck & test execution
│   │   ├── evaluator.md           ← Independent functional outcome assessment
│   │   ├── reviewer.md            ← Architectural & maintainability review
│   │   └── security-reviewer.md   ← Deep security audit & threat modeling
│   ├── hooks.json             ← Deterministic lifecycle hooks (PreToolUse safety guard)
│   └── security-hook.js       ← Hook forwarder for Antigravity runtime
│
├── .ai/                       ← AEW Control Plane
│   ├── settings.json          ← V3 configuration & path mappings
│   ├── orchestration/         ← Policy, classification & routing metadata
│   │   ├── skill-registry.json    ← Canonical skill metadata & domain mapping
│   │   ├── role-registry.json     ← Role definitions & subagent associations
│   │   ├── task-classifier.md     ← Multidimensional task classification
│   │   ├── model-routing.json     ← Abstract capability tiers (fast/standard/strong/critical)
│   │   ├── context-manifest.json  ← Context routing manifest mapping to .agents
│   │   ├── decision-policy.json   ← Ask-vs-Act autonomy policy (known → infer → research → ask)
│   │   ├── checkpoint-policy.json ← Human approval triggers
│   │   └── verification-schema.json ← Evidence-based quality gates
│   ├── state/                 ← Authoritative machine-readable state (atomic + versioned)
│   │   ├── project.json           ← Project metadata & revision counter
│   │   ├── tasks.json             ← Task DAG with atomic revision writes
│   │   ├── decisions.json         ← Logged inferences and architectural ADRs
│   │   ├── blockers.json          ← Active/resolved blockers
│   │   └── events.jsonl           # Append-only state mutation audit log
│   ├── scripts/               ← Deterministic support CLI tools
│   │   ├── state-io.js            ← Atomic tempfile writes + optimistic revision locking
│   │   ├── security-hook.js       ← Shell command safety inspection
│   │   ├── eval-runner.js         ← Outcome-based golden task runner & grader
│   │   ├── model-router.js        ← Capability-tier resolver
│   │   ├── task-graph.js          ← DAG integrity validator & manager
│   │   ├── status-manager.js      ← State machine transitions & projections
│   │   └── dna-stamper.js         ← Portable V3 DNA stamper for new projects
│   ├── telemetry/             ← Sanitized operational telemetry
│   ├── templates/             ← Reusable project artifacts
│   └── archive/               ← Historical records (legacy workflows, agents, skills)
│
├── codebase/                  ← Generated applications
├── doc/                       ← Product requirements, bugs, features
├── docs/                      ← Architecture and reference documentation
└── evals/                     ← Golden tasks benchmark corpus (GT-01 to GT-10)
```

---

## How to Get Started

1. Complete your PRD at **[doc/prd.md](doc/prd.md)**.
2. Message the AI agent:
   > *"I have completed my PRD. Please ingest doc/prd.md and start code generation."*

### V3 Core Capabilities

| Aspect | Description |
|--------|-------------|
| **Antigravity-Native** | Native Rules (`.agents/rules`), canonical Skills (`.agents/skills`), custom Subagents (`.agents/agents`) |
| **Deterministic Safety** | PreToolUse hooks (`.agents/hooks.json`) block dangerous destructive operations |
| **Multidimensional Routing** | Tasks classified across domain, complexity, security risk, and architectural impact |
| **Abstract Capability Tiers** | Routes to `fast`, `standard`, `strong`, or `critical` tiers rather than hardcoded models |
| **Concurrency-Safe State** | Atomic file writes via tempfiles and optimistic revision counters (`state-io.js`) |
| **Separate Verification & Evaluation** | Verifier checks engineering criteria (build, lint, tests); Evaluator independently tests user journeys |
| **Executable Golden Evals** | 10 golden tasks with automated outcome verification, independent grading, and baseline comparison |
| **Minimal Token Overhead** | Skills use progressive disclosure (metadata first); context routing limits overhead by up to 89% |

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

### Deterministic Security Hooks
```bash
# Test security hook guardrails against commands
node .ai/scripts/security-hook.js "git push --force origin main"   # DENIED
node .ai/scripts/security-hook.js "npm test"                       # ALLOWED
```

### Golden-Task Evaluations & Baseline Comparison
```bash
# Run executable outcome-based evaluations for GT-01 to GT-10
node .ai/scripts/eval-runner.js run

# Run comparative baseline evaluation (AEW orchestration vs naive un-orchestrated harness)
node .ai/scripts/eval-runner.js baseline
```

### Model Capability Tier Routing
```bash
# Inspect model tier routing decisions
node .ai/scripts/model-router.js tiers
node .ai/scripts/model-router.js route architecture --security critical
```

### Test & Regression Suites
```bash
# Tier-B verification suites
node .ai/scripts/v2-tier-b-wave1-test.js        # Wave 1 verification (18 checks)
node .ai/scripts/v2-tier-b-wave2-test.js        # Wave 2 verification (22 checks)
node .ai/scripts/v2-tier-b-regression-suite.js # 12-scenario real-world regression

# Core regression suite
node .ai/scripts/v2-dry-run.js                 # 64 architectural checks
node --experimental-strip-types --test codebase/backend/test/*.test.js
```

---

## 🐛 Fixing Bugs

1. Create a bug report: **`doc/bugs/[bug-name].md`** (template at `.ai/templates/bug-template.md`).
2. Message: *"I have created a bug report at doc/bugs/[bug-name].md. Please investigate and fix."*

## 🚀 Adding Features

1. Create a feature spec: **`doc/features/[feature-name].md`** (template at `.ai/templates/feature-template.md`).
2. Message: *"I have added a feature request at doc/features/[feature-name].md. Please analyze and implement."*
