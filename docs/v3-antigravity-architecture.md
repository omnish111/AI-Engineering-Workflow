# AEW V3 — Antigravity-First Engineering Architecture

## 1. Overview

**AEW V3** upgrades the software engineering harness to be **Antigravity-first** and **Skills-first**. Antigravity is the native runtime engine; its official filesystem mechanisms (`.agents/rules`, `.agents/skills`, `.agents/agents`, `.agents/hooks.json`) serve as the execution interface. The control plane (`.ai/`) provides durable state management, abstract model-tier routing, deterministic safety hooks, and outcome-based evaluations.

---

## 2. Directory Architecture

```
AI-Engineering-WorkFlow/
│
├── AGENTS.md                  # Canonical constitution: purpose, safety, autonomy, verification
├── GEMINI.md                  # Antigravity entry point: rules, skills, agents, hooks
├── CLAUDE.md                  # Minimal compatibility note
├── README.md                  # Human-facing overview & quickstart
│
├── .agents/                   # Antigravity Native Runtime Interface
│   ├── rules/                 # Native rules with triggers & scoping
│   │   ├── coding-rules.md        # always_on: TypeScript strictness & defensive invariants
│   │   ├── security.md            # always_on: Secret protection, sanitization, authn/authz
│   │   ├── architecture-rules.md  # model_decision: Layered boundaries & dependency flow
│   │   ├── naming-rules.md        # model_decision: Kebab-case, PascalCase, conventions
│   │   ├── ui-guidelines.md       # glob (*.{tsx,jsx,css}): States, contrast, responsive
│   │   ├── tech-stack.md          # model_decision: Baseline technologies & versions
│   │   └── project-context.md     # model_decision: Factory vs product isolation
│   ├── skills/                # 17 Canonical Agent Skills (progressive disclosure)
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
│   ├── agents/                # 7 Focused Antigravity Custom Subagents
│   │   ├── planner.md             # Requirements decomposition & DAG generation
│   │   ├── researcher.md          # Targeted technical/API investigations
│   │   ├── implementer.md         # Production code authoring
│   │   ├── verifier.md            # Build, lint, typecheck & test execution
│   │   ├── evaluator.md           # Independent functional outcome assessment
│   │   ├── reviewer.md            # Architectural & maintainability review
│   │   └── security-reviewer.md   # Deep security audit & threat modeling
│   ├── hooks.json             # Deterministic lifecycle hooks (PreToolUse safety guard)
│   └── security-hook.js       # Hook forwarder for Antigravity runtime
│
├── .ai/                       # AEW Control Plane
│   ├── settings.json          # V3 configuration & path mappings
│   ├── orchestration/         # Policy, classification & routing metadata
│   │   ├── skill-registry.json    # Canonical skill metadata & domain mapping
│   │   ├── role-registry.json     # Role definitions & subagent associations
│   │   ├── task-classifier.md     # Multidimensional task classification
│   │   ├── model-routing.json     # Abstract capability tiers (fast/standard/strong/critical)
│   │   ├── context-manifest.json  # Context routing manifest mapping to .agents
│   │   ├── decision-policy.json   # Ask-vs-Act autonomy policy
│   │   ├── checkpoint-policy.json # Human approval triggers
│   │   └── verification-schema.json # Evidence-based quality gates
│   ├── state/                 # Authoritative machine-readable state
│   │   ├── project.json           # Project metadata & revision counter
│   │   ├── tasks.json             # Task DAG with atomic revision writes
│   │   ├── decisions.json         # Logged inferences and architectural ADRs
│   │   ├── blockers.json          # Active/resolved blockers
│   │   └── events.jsonl           # Append-only state mutation audit log
│   ├── scripts/               # Deterministic support CLI tools
│   │   ├── state-io.js            # Atomic tempfile writes + optimistic locking
│   │   ├── security-hook.js       # Shell command safety inspection
│   │   ├── eval-runner.js         # Outcome-based golden task runner & grader
│   │   ├── model-router.js        # Capability-tier resolver
│   │   ├── task-graph.js          # DAG integrity validator & manager
│   │   ├── status-manager.js      # State machine transitions & projections
│   │   └── dna-stamper.js         # Portable V3 DNA stamper for new projects
│   └── archive/               # Historical records (legacy workflows, agents, skills)
│
├── codebase/                  # Application code (backend/frontend)
├── doc/                       # PRDs and feature specifications
├── docs/                      # Architecture and reference documentation
└── evals/                     # Golden tasks corpus with executable outcome checks
```

---

## 3. Core Subsystems

### 3.1 Antigravity Native Interface
- **Rules**: In `.agents/rules/`, persistent constraints use Antigravity frontmatter (`always_on`, `model_decision`, `glob`).
- **Skills**: In `.agents/skills/`, 17 skills provide progressive disclosure (metadata first, procedures on activation).
- **Subagents**: In `.agents/agents/`, custom subagents provide context isolation for specialized activities.
- **Hooks**: In `.agents/hooks.json`, deterministic safety checks block dangerous shell commands before execution.

### 3.2 State Management & Concurrency
- All state mutations in `.ai/state/` are handled through `.ai/scripts/state-io.js`.
- Writes are executed atomically using temporary file writes followed by file replacement.
- Revision counters (`revision`) enforce optimistic concurrency control to prevent race conditions during parallel task execution.
- An append-only event stream (`events.jsonl`) logs every mutation for full auditability.

### 3.3 Abstract Capability-Tier Model Routing
Rather than hardcoding specific model versions into prompts or scripts, AEW V3 routes tasks to abstract capability tiers:
- **`fast`**: Low-latency edits, formatting, and narrow documentation (Gemini Flash-class).
- **`standard`**: Routine implementation, standard CRUD, and unit testing (Gemini Pro-class).
- **`strong`**: Complex planning, multi-module architecture, and difficult debugging (Gemini Thinking / Claude Sonnet tier).
- **`critical`**: High-blast-radius security audits, cryptographic algorithms, and root-cause failure analysis (Claude Opus / Gemini Ultra tier).

### 3.4 Verification vs. Evaluation vs. Review
- **Verifier** (`verifier.md`): Confirms engineering checks pass (compilation, typechecking, linting, tests).
- **Evaluator** (`evaluator.md`): Independently assesses whether the requested user journey and acceptance criteria work in practice.
- **Reviewer** (`reviewer.md` / `security-reviewer.md`): Evaluates maintainability, architecture, and security posture.
