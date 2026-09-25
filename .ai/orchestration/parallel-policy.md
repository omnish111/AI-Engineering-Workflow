# Safe Parallel Work Policy

## Purpose

Define when and how parallel work is safe, and when isolation is required.

## When Isolation is Required (Git Worktrees)

Use isolated git worktrees when:
- Two tasks modify the **same files** or **same module**
- Tasks have **conflicting dependencies** (e.g., different package versions)
- Tasks involve **database schema changes** that could conflict
- Tasks require **different environment configurations**

## When Shared Workspace is Safe

Tasks can run in the same workspace when:
- They modify **completely independent modules** (e.g., auth module vs analytics module)
- They work on **different layers** (e.g., backend API vs frontend UI with stable API contract)
- One task is **read-only** (e.g., code review, testing)
- Tasks have **no file overlap** in their expected outputs

## Parallel Task Detection

From the task DAG, identify parallelizable tasks:
1. Find all tasks with status `READY` (all dependencies satisfied)
2. Check output file paths for overlap
3. If no overlap → safe for parallel execution
4. If overlap → execute sequentially or use worktrees

## Conflict Detection

Before merging parallel work:
1. Check for file conflicts (same file modified by multiple tasks)
2. Check for semantic conflicts (e.g., both tasks add to the same config)
3. If conflicts detected, flag for manual resolution

## Integration with Antigravity

When the host agent supports subagent worktrees:
- Use the agent's native worktree capabilities
- Do not reimplement worktree management
- Provide task context to subagents via `.ai/state/tasks.json`

## Output Collection

Each parallel task must:
1. Record all files created/modified in its verification evidence
2. Update its task status in `.ai/state/tasks.json` upon completion
3. Not modify files outside its declared output scope

## Merge/Reconciliation

1. Completed parallel tasks are reconciled by the orchestrator
2. File conflicts are flagged as blockers
3. Successful merges update the task graph and propagate completion
