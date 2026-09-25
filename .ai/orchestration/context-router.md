# Context Router

## Purpose

Determine which context files to load for a given task. This replaces the V1 behavior of always loading all context files.

## How It Works

1. Classify the task type (see `task-classifier.md`)
2. Look up the task type in `context-manifest.json` → `taskTypeToContextGroups`
3. Load only the files listed in those context groups
4. Add any task-specific files (e.g., specific source files being modified)

## Example

### Task: Fix login bug

1. Classification: `bug-fix`
2. Context groups: `core`, `bug-fix`, `state`
3. Files loaded:
   - `.ai/settings.json` (core)
   - `.ai/state/project.json` (core)
   - `.ai/skills/bug-fix/SKILL.md` (bug-fix)
   - `.ai/skills/debugging/SKILL.md` (bug-fix)
   - `.ai/skills/testing/SKILL.md` (bug-fix)
   - `.ai/context/coding-rules.md` (bug-fix)
   - `.ai/state/tasks.json` (state)
   - `.ai/state/blockers.json` (state)
   - `.ai/state/decisions.json` (state)
4. Task-specific: `codebase/backend/modules/auth/**` (affected files)

### Files NOT loaded:
- `.ai/skills/frontend/SKILL.md` (not relevant)
- `.ai/skills/deployment/SKILL.md` (not relevant)
- `.ai/context/ui-guidelines.md` (not relevant)
- `.ai/skills/docker/SKILL.md` (not relevant)

## Rules

1. Always load the `core` context group
2. Load additional groups based on task classification
3. When a task affects both backend and frontend, load both groups
4. When a task involves auth/security, always load the security group
5. When resuming work, always load the state group
6. Never load all groups simultaneously unless the task genuinely requires it
7. Prefer reading specific files on-demand over preloading everything
