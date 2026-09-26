---
name: verifying-changes
description: Collects concrete command, test, build, lint, and runtime verification evidence before claiming task completion. Use when verifying code changes or preparing task handoff.
---

# Purpose
Systematically execute engineering verification gates, capture concrete output logs, exit codes, and timestamps, and record undeniable evidence of correctness before declaring any task complete.

# When to Use
- After implementation or refactoring is finished, before marking a task as COMPLETED.
- As part of the pre-commit or pre-merge validation gate.
- When producing verification artifacts for auditability.

# Procedure
1. **Identify Required Verification Gates**:
   - Determine which checks are necessary based on modified files:
     - **TypeScript/JavaScript**: Build, compilation, typecheck (`tsc --noEmit`), linter.
     - **Backend / APIs**: Unit tests, integration tests, status code asserts.
     - **Frontend**: Component rendering, visual regression, browser console checks.
2. **Execute Commands in Clean Environment**:
   - Run verification commands via terminal.
   - Prohibit claiming completion based on assumptions or past runs.
3. **Capture & Validate Evidence**:
   - Inspect command exit code (must be `0`).
   - Parse summary output (passed tests, zero failures, zero warnings if strict).
4. **Record Evidence in Task State**:
   - Update `.ai/state/tasks.json` with `verificationEvidence`: command run, exit code, duration, and pass status.

# Decision Tree
```
Verify Changes
├── Modified TS/JS files? ──► Run typecheck/lint ──► Must exit 0
├── Modified business logic/APIs? ──► Run unit/integration tests ──► Must pass 100%
├── Modified frontend? ──► Verify build + render check
└── All gates passed?
    ├── Yes ──► Record evidence in state ──► Proceed to evaluation/review
    └── No ──► Do NOT claim completion ──► Hand off failure log to debugging
```

# Verification
- Actual command execution log with timestamp and exit code `0`.
- Zero unverified assumptions or skipped checks.
- Verification evidence attached to task state.

# References
- [Verifier Subagent](file:///e:/AI%20Engineering%20Workflow/.agents/agents/verifier.md)
- [Verification Schema](file:///e:/AI%20Engineering%20Workflow/.ai/orchestration/verification-schema.json)
