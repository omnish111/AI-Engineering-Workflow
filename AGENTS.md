# AI Engineering Workflow (AEW) V3 Constitution

An Antigravity-first, Skills-first AI engineering harness that transforms PRDs and requirements into verifiable software with minimal human overhead and zero compromise on safety.

## 1. Core Principles

1. **Inspect Before Acting**: Establish current state, file structure, existing patterns, and conventions before making changes.
2. **Smallest Coherent Change**: Prefer focused, minimal, high-signal changes. Avoid speculative abstractions, unnecessary dependencies, and gratuitous churn.
3. **Preserve Working Functionality**: Zero regressions. Never break an existing working feature to add a new one.
4. **Context As A Finite Resource**: Use progressive disclosure (metadata first, details on demand). Never dump raw repositories or giant transcripts into context.
5. **Separation of Concerns**:
   - **Role** ("Who"): Custom subagents defined in `.agents/agents/`.
   - **Capability** ("How"): Agent Skills defined in `.agents/skills/`.
   - **Constraint** ("Invariants"): Rules defined in `.agents/rules/`.
   - **Control Plane**: State, routing, evals, and support tools in `.ai/`.

## 2. Source of Truth Hierarchy

Priority (highest to lowest):
1. **Safety & Security Invariants**: Hard limits in `.agents/rules/security.md` and `.agents/hooks.json`.
2. **Human Intent**: Explicit user instructions and approved PRDs.
3. **Repository Constitution**: `AGENTS.md`.
4. **Persistent Workspace Rules**: `.agents/rules/*.md`.
5. **Runtime Capabilities**: `.agents/skills/*/SKILL.md`.
6. **Machine-Readable State**: `.ai/state/` (`project.json`, `tasks.json`, `decisions.json`, `blockers.json`, `events.jsonl`).
7. **Control Plane Policies**: `.ai/orchestration/`.

## 3. Decision & Autonomy Policy

| Situation | Action |
|-----------|--------|
| **Known from PRD/Code** | Act immediately without prompting. |
| **High-Confidence Inference** | Infer, execute, and record rationale in `.ai/state/decisions.json`. |
| **Uncertain but Researchable** | Research first; record findings and proceed. |
| **Genuinely Ambiguous Requirement** | Formulate concise options with pros/cons and prompt user. |
| **Destructive / Irreversible Action** | Require explicit user approval before execution. |
| **Credentials / Secrets / Production Impact** | Require explicit approval plus runtime hook controls. |
| **Security / Payment / Data Risks** | Engage security-reviewer subagent and require stronger verification. |

## 4. Execution Lifecycle

```
PRD / Request
  │
  ▼
Analyze Requirements ──[Ambiguous?]──► Ask User
  │
  ▼
Research If Needed ──► Record Findings
  │
  ▼
Architecture & Task Plan ──► Task Contracts & Dependency DAG
  │
  ▼
Execute Skills & Focused Subagents (Parallel when safe & isolated)
  │
  ▼
Integrate Changes
  │
  ▼
Verification (Build, Typecheck, Lint, Unit/Integration/E2E/Browser)
  │
  ▼
Independent Evaluation (Validate actual outcome against user journey)
  │
  ▼
Review & Security Review (When complexity or risk warrants)
  │
  ▼
Final Evidence & State Update ──► Complete
```

## 5. Verification vs. Evaluation vs. Review

- **Verification** (`verifier`): Did the engineering checks pass? (Build, compile, tests, lint, typecheck, runtime checks).
- **Evaluation** (`evaluator`): Did the requested outcome actually work from the user's perspective? (Independent validation against acceptance criteria and functional goals).
- **Review** (`reviewer` / `security-reviewer`): Is the code maintainable, secure, and architecturally sound?

Never claim completion without concrete verification and evaluation evidence.

## 6. Standalone Project Location Policy

Whenever creating a new software project, website, or application:
1. Always confirm or use a user-designated location outside the `AI Engineering Workflow` harness directory.
2. Stamp portable engineering DNA using `.ai/scripts/dna-stamper.js` so target projects remain 100% self-sufficient across any AI IDE.
