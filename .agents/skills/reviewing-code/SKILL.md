---
name: reviewing-code
description: Reviews code changes for correctness, maintainability, architectural integrity, performance, and adherence to repository conventions. Use when performing code reviews or pre-merge audits.
---

# Purpose
Review diffs and new implementations to ensure high code quality, adherence to architectural invariants, clean abstraction boundaries, and maintainable software patterns.

# When to Use
- Before marking complex or high-risk tasks complete.
- When evaluating pull requests, feature branches, or refactoring diffs.
- Verifying adherence to repository coding rules and architectural boundaries.

# Procedure
1. **Analyze Diff Scope**:
   - Inspect `git diff` or changed files against baseline.
   - Verify that the change represents the smallest coherent modification required.
2. **Evaluate Invariants & Standards**:
   - Check strict TypeScript standards (no `any`, proper error handling).
   - Verify layer separation: controllers do not execute DB queries; services do not access HTTP request objects.
   - Ensure no circular dependencies or redundant packages introduced.
3. **Check Defensive Patterns**:
   - Confirm defensive checks on external inputs and nullable references.
   - Verify resources (sockets, file descriptors, DB connections) are cleanly closed or managed.
4. **Deliver Structured Findings**:
   - Categorize comments into:
     - `BLOCKING`: Defect, security flaw, or architecture violation.
     - `SUGGESTION`: Optimization, style improvement, or minor refactor.
     - `COMMENDATION`: Well-designed pattern or clean test.

# Decision Tree
```
Review Code Diff
├── Are there architecture or security violations? ──► Status: CHANGES_REQUESTED (Blocking)
├── Are there unhandled edge cases or regressions? ──► Status: CHANGES_REQUESTED (Blocking)
├── Are there only minor style/optimization suggestions? ──► Status: APPROVED with suggestions
└── Clean diff meeting all standards? ──► Status: APPROVED
```

# Verification
- All blocking items identified with specific file and line numbers.
- Code review report recorded with clear rationale for every finding.

# References
- [Reviewer Subagent](file:///e:/AI%20Engineering%20Workflow/.agents/agents/reviewer.md)
- [Coding Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/coding-rules.md)
- [Architecture Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/architecture-rules.md)
