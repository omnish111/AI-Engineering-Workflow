---
name: verification
description: Change verification, quality gates, and acceptance criteria validation.
triggers:
  - task completion verification needed
  - phase advancement validation
  - code review required
  - quality gate check
required_context:
  - .ai/state/tasks.json
  - .ai/orchestration/verification-schema.json
---

# Verification Skill

## When to Use

Activate this skill when:
- A task claims to be complete and needs verification
- A phase is ready for advancement
- Code review is required for changes
- Quality gates need to be checked

## Execution Instructions

### 1. Gather Evidence
For each completed task, collect verification evidence:
- Commands executed and their outputs
- Tests executed and results
- Changed files list
- Acceptance criteria status (pass/fail for each)

### 2. Automated Checks
- Run `node .ai/scripts/validate-project.js` for codebase compliance
- Run relevant test suites (use impact-aware testing)
- Check for TypeScript compilation errors
- Verify no `any` types in production code

### 3. Quality Gate Assessment
| Gate | Criteria |
|------|----------|
| Compilation | Zero errors |
| Unit Tests | All pass, coverage ≥80% |
| Integration Tests | All pass |
| Code Review | Zero CRITICAL/HIGH findings |
| Documentation | API docs complete |
| Dependencies | No circular deps, no vulnerable packages |

### 4. Verification Report
Output a structured verification report:
```json
{
  "taskId": "TASK-XXX",
  "status": "PASSED|FAILED",
  "evidence": {
    "commandsExecuted": [...],
    "testsRun": 42,
    "testsPassed": 42,
    "testsFailed": 0,
    "filesChanged": [...],
    "acceptanceCriteria": [
      { "criterion": "...", "status": "PASSED" }
    ]
  },
  "failures": [],
  "timestamp": "..."
}
```

### 5. Decision
- **PASSED**: Mark task as COMPLETED, propagate completion
- **FAILED**: Mark specific failures, trigger retry if within policy
- **BLOCKED**: Escalate to blockers, request human input

## Verification Expectations

- Every completed task has verification evidence
- No task marked complete without passing quality gates
- Verification report is machine-readable
