---
name: planning
description: Decomposes requirements into phased implementation plans, atomic task contracts, dependency DAGs, and milestone roadmaps. Use when breaking down features, roadmaps, or complex tasks.
---

# Purpose
Create structured, phased implementation plans and machine-readable task graphs (`.ai/state/tasks.json`) with explicit dependencies, inputs, outputs, and acceptance criteria.

# When to Use
- Requirements have been analyzed and need decomposition into implementation phases.
- New features, architectural refactoring, or multi-step engineering tasks need scheduling.
- Managing task DAG state and evaluating task readiness.

# Procedure
1. **Deconstruct Scope**:
   - Divide features into logical phases (e.g., Phase 1: Core Foundation & Schemas, Phase 2: Business Logic & APIs, Phase 3: UI & Integration).
   - Break phases into atomic tasks that take <= 2 hours of engineering effort each.
2. **Formulate Task Contracts**:
   - Assign each task:
     - `id`: Unique identifier (e.g., `PHASE-01-TASK-001` or `task-backend-auth`).
     - `description`: Clear purpose and expected behavior.
     - `role`: Specialized role (`implementer`, `verifier`, etc.).
     - `inputs`: Specific prerequisite files or schemas.
     - `outputs`: Expected file paths to create/modify.
     - `acceptanceCriteria`: Array of explicit verification conditions.
     - `dependsOn`: Array of prerequisite task IDs.
     - `complexity`: `S`, `M`, `L`, or `XL`.
3. **Validate DAG Integrity**:
   - Ensure the dependency graph is acyclic.
   - Run `node .ai/scripts/task-graph.js validate` to guarantee consistency.
4. **State Commitment**:
   - Write tasks to `.ai/state/tasks.json` and synchronize markdown projections via `node .ai/scripts/status-manager.js sync`.

# Decision Tree
```
Task Decomposition
├── Single isolated file/fix? ──► Create single-task contract ──► Execute directly
└── Multi-module or multi-layer feature?
    ├── Identify boundary layers (DB -> Service -> API -> UI)
    ├── Construct dependency links (API dependsOn DB; UI dependsOn API)
    ├── Check parallel opportunities (independent backend & frontend mock)
    └── Validate DAG with task-graph.js
```

# Verification
- `node .ai/scripts/task-graph.js validate` exits 0 with zero circular dependencies and zero missing references.
- Every task specifies explicit output paths and acceptance criteria.

# References
- [Task Graph Manager](file:///e:/AI%20Engineering%20Workflow/.ai/scripts/task-graph.js)
- [Status Manager](file:///e:/AI%20Engineering%20Workflow/.ai/scripts/status-manager.js)
