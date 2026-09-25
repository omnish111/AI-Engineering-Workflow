---
name: planning
description: Strategic planning, task decomposition, dependency graph generation, and phased roadmap creation.
triggers:
  - PRD analysis complete, planning needed
  - task breakdown required
  - dependency graph generation
  - roadmap creation or update
required_context:
  - .ai/state/project.json
  - .ai/context/architecture-rules.md
  - .ai/context/tech-stack.md
---

# Planning Skill

## When to Use

Activate this skill when:
- A PRD has been analyzed and planning is needed
- Tasks need to be decomposed from features
- A dependency graph needs to be generated
- A phased roadmap needs creation or updating

## Execution Instructions

### 1. Architecture Design
- Design system architecture aligned with selected tech stack
- Database schema design
- API contract design
- Folder structure planning

### 2. Task Decomposition
Break features into atomic tasks. Each task must have:
```json
{
  "id": "TASK-XXX",
  "description": "Clear action statement",
  "type": "backend|frontend|database|testing|security|deployment",
  "role": "implementer|verifier|reviewer",
  "priority": "P0|P1|P2|P3",
  "complexity": "S|M|L|XL",
  "dependsOn": ["TASK-YYY"],
  "context": [".ai/skills/backend/SKILL.md"],
  "outputs": ["codebase/backend/modules/auth/**"],
  "acceptanceCriteria": ["POST /auth/register creates a user"],
  "verification": { "type": "test", "command": "npm test -- --grep auth" },
  "status": "PENDING",
  "retryPolicy": { "maxRetries": 3, "backoff": "exponential" }
}
```

### 3. Dependency Graph Validation
- Ensure all task IDs are unique
- Validate no circular dependencies exist
- Verify all `dependsOn` references point to valid tasks
- Identify independent tasks that can run in parallel

### 4. Phased Roadmap
- Group tasks into logical phases
- Respect dependency ordering within and across phases
- Estimate complexity per phase
- Write to `.ai/state/tasks.json`

### 5. Dynamic Role Selection
Select only required roles per task. Do NOT activate all agents for every task.

## Verification Expectations

- Every PRD feature maps to at least one task
- Task dependency graph is a valid DAG (no cycles)
- All task IDs are unique
- Every task has acceptance criteria
- Phase ordering respects dependency chains
