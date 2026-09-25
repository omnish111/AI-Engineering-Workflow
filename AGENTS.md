# AI Engineering Workflow (AEW) — Workspace Rules

This repository runs a cooperative AI agent software factory configured in `.ai/`. All agents and AI coding assistants must adhere to the rules and conventions defined herein.

## Architecture Version

**V2 Tier-B** — Enterprise automation, observability, golden evals, dynamic model routing, worktree isolation, and multi-project support.

## Core Directives

1. **User-Prompted Project Location (MANDATORY)**: Whenever starting a new software, website, or application, you MUST explicitly ask the user for the target location. If the user provides a disk or parent directory (e.g. `E:\`, `D:\Projects`), create the new project inside `<provided-path>/<software-name>/` (outside of the `AI Engineering Workflow` factory folder). The new software must be a clean, standalone project ready for deployment. NEVER mix new software code into `AI Engineering Workflow`.
2. **Portable Engineering DNA (MANDATORY)**: Every project created or onboarded receives self-contained `.ai/` intelligence infrastructure, `AGENTS.md`, and `GEMINI.md` via `.ai/scripts/dna-stamper.js`. Projects are 100% self-sufficient and can be edited in any AI IDE without depending on this factory.
3. **Chat-First Interaction (MANDATORY)**: The user interacts directly through chat. The AI agent must automatically create and maintain all necessary PRD files, task definitions, and state files under the hood. Never require the user to manually create, format, or edit markdown files.
4. **Tech Stack**: Refer to [.ai/settings.json](.ai/settings.json) for tech stack rules and conventions.
5. **Coding Standards**: Follow [.ai/context/coding-rules.md](.ai/context/coding-rules.md) and [.ai/context/ui-guidelines.md](.ai/context/ui-guidelines.md).
6. **Architecture**: Follow [.ai/context/architecture-rules.md](.ai/context/architecture-rules.md).
7. **Naming**: Follow [.ai/context/naming-rules.md](.ai/context/naming-rules.md).

## Primary Workflows

The factory operates two core high-performance paths:
1. **Fresh Build (Default)**: User provides PRD or requirements in chat → Resolve target directory outside factory → Scaffold modern project (Next.js / React / Tailwind CSS / shadcn/ui) → Stamp portable engineering DNA (`node .ai/scripts/dna-stamper.js`) → Deliver world-class responsive UI & robust backend per [.ai/context/ui-guidelines.md](.ai/context/ui-guidelines.md) and [.ai/context/coding-rules.md](.ai/context/coding-rules.md) → Verify before declaring complete.
2. **Maintenance & Updates**: Inspect codebase & existing conventions first → Propose smallest coherent change → Implement using task-specific skills (`feature-development`, `bug-fix`, `code-review`) → Verify with zero regressions.

*(Specialized operations like legacy repo onboarding, security audits, or deep competitor research are available on-demand via `.ai/skills/` when explicitly requested by the user.)*

## V2 Orchestration Model

### Skills-First
- Skills are the primary reusable execution unit: `.ai/skills/[name]/SKILL.md`
- Each skill has YAML frontmatter defining triggers and required context
- Load only skills relevant to the current task

### Dynamic Agent Roles
- The orchestrator selects which roles are needed per task
- Roles defined in `.ai/orchestration/role-registry.json`
- Task classification in `.ai/orchestration/task-classifier.md`
- Do NOT activate all agents for every task

### Task DAG
- Tasks are stored as a dependency graph in `.ai/state/tasks.json`
- Validate with `node .ai/scripts/task-graph.js validate`
- Independent tasks may execute in parallel when safe

### Context Loading
- Use `.ai/orchestration/context-manifest.json` to determine what to load
- Never load all context files for every task
- Follow `.ai/orchestration/context-router.md` for routing rules

### Machine-Readable State
- **Source of truth**: `.ai/state/` (JSON/JSONL files)
- **Derived views**: `.ai/project-management/` (Markdown dashboards generated from state)
- Sync with `node .ai/scripts/status-manager.js sync`

### Decision Policy
- Follow `.ai/orchestration/decision-policy.json` for Ask vs Act behavior
- Do NOT ask unnecessary questions when answers are inferrable
- Log decisions in `.ai/state/decisions.json`

### Human Checkpoints
- Follow `.ai/orchestration/checkpoint-policy.json`
- Autonomous for routine reversible actions
- Ask user for destructive, production, or credential actions

### Verification
- Every task needs verification evidence before completion
- Follow `.ai/orchestration/verification-schema.json`
- An executor cannot declare its own work complete without proof

## File Hierarchy

```
Priority (highest to lowest):
1. .ai/orchestration/checkpoint-policy.json    — Safety policy
2. .ai/settings.json                           — Project configuration
3. .ai/context/                                — Coding rules and conventions
4. .ai/skills/[name]/SKILL.md                  — Skill instructions
5. .ai/state/                                  — Current project state
6. .ai/agents/orchestrator.md                  — Orchestration behavior
7. .ai/orchestration/                          — Orchestration policies
```
