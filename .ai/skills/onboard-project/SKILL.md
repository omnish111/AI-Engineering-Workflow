---
name: onboard-project
description: Onboards any existing or half-built external codebase into the AI Engineering platform, scanning its tech stack, executing strategic research, embedding portable engineering DNA, and generating an improvement roadmap.
triggers:
  - onboard project
  - scan existing project
  - adopt codebase
  - analyze existing codebase
  - import existing project
required_context:
  - .ai/templates/dna/AGENTS.md.template
  - .ai/templates/dna/settings.json.template
  - .ai/projects/registry.json
---

# Project Onboarding Skill

## When to Use

Activate this skill when:
- The user provides an existing, legacy, or half-built software folder and wants to bring it under AI Engineering governance.
- A project built outside the factory needs an `AGENTS.md`, `.ai/` context, coding rules, and architecture blueprints.
- You need to benchmark an existing codebase against market leaders and generate a strategic improvement roadmap.

## Workflow: 6-Step Onboarding Pipeline

```
1. SCAN ──► 2. ANALYZE ──► 3. RESEARCH ──► 4. STAMP DNA ──► 5. REGISTER ──► 6. ROADMAP
```

### Step 1: Scan Target Codebase
Run the scanner script against the target project directory:
```bash
node .ai/scripts/project-scanner.js "<targetDirectory>"
```
This automatically captures:
- Framework (Next.js, React, NestJS, Express, Vue, etc.)
- Language & TypeScript setup
- Styling system (Tailwind, CSS modules, Vanilla CSS, etc.)
- Database & ORM (Mongoose, Prisma, TypeORM, Drizzle, etc.)
- Available scripts (`dev`, `build`, `test`, `lint`)
- Routes, controllers, and database schema files
- File count and lines of code (LOC)

### Step 2: Code Health & Architecture Analysis
Examine the scan findings:
- Identify state management patterns, API boundary designs, and component structures.
- Evaluate missing foundations: Are tests present? Is linting configured? Are environment variables documented in a `.env.example`?
- Note technical debt, tight coupling, or anti-patterns.

### Step 3: Trigger 5D Strategic Research
Activate the `strategic-research` skill for the project's domain:
- Identify top competitors in this product vertical.
- Review UX/UI design standards in 2026.
- Detect features that competitors offer which the scanned project currently lacks.
- Save report to `[targetDir]/.ai/research/strategic-report-[topic].md`.

### Step 4: Stamp Portable Engineering DNA
Execute the DNA stamper script to embed the self-contained `.ai/` configuration into the project:
```bash
node .ai/scripts/dna-stamper.js "<targetDirectory>"
```
This generates inside the target project:
- `AGENTS.md`: Authoritative engineering guidelines, key commands, structure rules.
- `GEMINI.md`: Antigravity IDE adapter.
- `.ai/settings.json`: Project metadata and detected stack.
- `.ai/context/architecture.md`: Architecture blueprint.
- `.ai/context/coding-rules.md`: Code conventions and styling policies.
- `.ai/state/project.json`: Project state tracking.
- `.ai/state/decisions.json`: Initial architectural decisions log.

### Step 5: Register in Factory Registry
Update the factory's `.ai/projects/registry.json` so the factory tracks this project:
- Add entry with project ID, absolute path, detected tech stack, onboarding date, and mode (`onboarded`).

### Step 6: Generate Prioritized Improvement Roadmap
Create `[targetDir]/.ai/improvements/roadmap.md` with 3 prioritized tiers:
1. **Tier 1: Quick Wins** (missing `.env.example`, type fixes, test setup, broken links)
2. **Tier 2: Competitive Parity** (features that top competitors have that are missing here)
3. **Tier 3: Strategic Differentiators** (cutting-edge 2026 patterns, AI features, performance optimizations)

Present the onboarding summary, scan results, and roadmap to the user.
