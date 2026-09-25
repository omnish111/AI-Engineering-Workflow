# Worktree Lifecycle Policy (V2 Tier-B)

## 1. Overview

Git worktrees provide clean, filesystem-level isolation for parallel agent task execution. This policy coordinates native Git worktrees with the SaaS AI Factory task DAG and Antigravity subagents without reimplementing the native platform worktree engine.

## 2. Worktree Lifecycle

```
[DAG Task: READY]
       │
       ▼
   1. CREATE       → Create branch `feat/<taskId>` & worktree at `.worktrees/<taskId>`
       │
       ▼
 2. ATTACH TASK    → Link worktree metadata into `.ai/state/tasks.json`
       │
       ▼
  3. EXECUTE       → Agent / Subagent executes task in isolated worktree directory
       │
       ▼
  4. VERIFY        → Run automated test suite within worktree environment
       │
       ▼
  5. COLLECT       → Collect outputs, test results, and verification evidence
       │
       ▼
 6. RECONCILE      → Merge branch into primary branch (or create PR)
       │
       ▼
  7. REMOVE        → Safe cleanup (REFUSES removal if uncommitted or unmerged)
```

## 3. Worktree Naming & Directory Convention

- **Directory**: `.worktrees/<taskId>`
- **Branch**: `feat/<taskId>` (or `fix/<taskId>`)
- **Metadata**: Recorded in `tasks.json` under `task.worktree`:
  ```json
  {
    "path": ".worktrees/TASK-001",
    "branch": "feat/TASK-001",
    "createdAt": "2026-09-17T06:00:00Z",
    "status": "ATTACHED|EXECUTING|VERIFIED|RECONCILED"
  }
  ```

## 4. Safety & Invariant Rules

1. **Uncommitted Work Protection**:
   `worktree-manager cleanup` MUST run `git status --porcelain` inside the worktree before removal. If any modified, added, or untracked files exist, cleanup is aborted.

2. **Unmerged Branch Protection**:
   `worktree-manager cleanup` checks whether the branch has been merged into the parent branch. If unmerged, cleanup is aborted unless explicit force override is provided.

3. **Conflict Handling**:
   If reconciliation triggers a merge conflict, worktree status is marked `CONFLICT`, task status is marked `HUMAN_REQUIRED`, and conflict files are reported.

4. **Stale Worktree Detection**:
   Worktrees associated with completed or failed tasks older than 48 hours are flagged as candidates for reconciliation or safe cleanup.
