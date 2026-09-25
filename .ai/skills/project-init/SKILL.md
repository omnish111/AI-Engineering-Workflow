---
name: project-init
description: Project initialization, scaffolding, and configuration setup.
triggers:
  - new project creation
  - project scaffolding
  - initial configuration setup
  - tech stack selection
required_context:
  - .ai/settings.json
  - .ai/context/project-context.md
  - .ai/context/tech-stack.md
---

# Project Initialization Skill

## When to Use

Activate this skill when:
- A new project is being initialized from a PRD
- Project scaffolding is required
- Initial tech stack configuration needs to be set
- Git repository strategy needs to be configured

## Execution Instructions

### 1. PRD Ingestion & Intent Analysis
- Read `doc/prd.md` or infer requirements directly from the user chat prompt.
- Extract: product domain, target audience, core features, user workflows, design preferences, and NFRs.
- Apply Ask vs Act policy (.ai/orchestration/decision-policy.json): Infer standard stack choices (Next.js, TypeScript, Tailwind CSS, shadcn/ui) without asking unnecessary questions; ask only if genuinely ambiguous.

### 2. Target Directory Resolution
- Prompt user for target directory location if not already provided.
- If user provides a disk or parent path (e.g. `E:\`, `D:\Projects`), resolve target to `<provided-path>/<software-name>/` (strictly outside the factory folder).
- Ensure target directory exists and is initialized cleanly.

### 3. Modern Project Scaffolding
- Scaffold the project files in `<resolved-target-directory>`:
  - For Web Applications: Modern Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.
  - Configure root layout, fonts (e.g. Inter/Outfit), responsive viewport, and basic routing.
  - Setup `.env.example` and base configurations.

### 4. Portable Engineering DNA Stamping (MANDATORY)
- Run `node .ai/scripts/dna-stamper.js "<resolved-target-directory>"`
- Injects standalone `AGENTS.md`, `GEMINI.md`, full authoritative `.ai/context/` (155-line coding rules, 195-line UI guidelines, architecture rules, tech stack), and self-contained execution skills.
- The project becomes 100% autonomous and ready for any AI IDE.

### 5. Multi-Project Registration
- Add or update entry in `.ai/projects/registry.json` with status `ACTIVE` and mode `created`.
- Initialize target task DAG in `<target>/.ai/state/tasks.json`.

### 6. Immediate Execution Kickoff (Inside-Out Pattern)
- Transition immediately to implementation using `frontend`, `uiux`, and `backend` skills:
  - **Design Foundation**: Configure design tokens, color palette, dark mode, typography in `globals.css` per `ui-guidelines.md`.
  - **Key UI Pages**: Build rich hero, interactive components, responsive layout, glassmorphic elements, and micro-interactions.
  - **Backend & Logic**: Connect API routes, schemas, and data fetching with defensive state handling (loading, empty, error).
  - **Verification Gate**: Run build (`npm run build`) and verify all pages render cleanly before declaring complete.

*(Note: If the user explicitly requests market research, trigger `strategic-research` as an optional pre-step. Never block project creation with mandatory competitor analysis.)*

## Verification Expectations

- External target directory `<resolved-target-directory>` exists and is isolated outside the factory.
- Standalone `.ai/` and `AGENTS.md` are stamped into the target project with full context files.
- Project builds cleanly (`npm run build`) with zero type errors.
- UI adheres to modern aesthetics defined in `ui-guidelines.md`.
- `.ai/projects/registry.json` reflects the new project entry.

