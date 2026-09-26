---
name: debugging-software
description: Investigates runtime errors, test failures, and regressions using systematic reproduction, root-cause analysis, and targeted remediation. Use when fixing bugs or debugging failures.
---

# Purpose
Reproduce, isolate, hypothesize, remediate, and regression-test software bugs and test failures systematically without introducing side-effects.

# When to Use
- A test fails, a build breaks, or an exception/crash occurs.
- A bug report is submitted in `doc/bugs/` or chat.
- Unexpected state transitions or intermittent flakiness are observed.

# Procedure
1. **Reproduce with Minimal Test Case**:
   - Write a failing automated test reproducing the exact failure before modifying production code.
   - Capture error message, stack trace, and environmental conditions.
2. **Isolate & Formulate Hypotheses**:
   - Trace execution from point of failure backwards to the root cause.
   - Formulate a testable hypothesis explaining why the bug occurs.
3. **Targeted Remediation**:
   - Implement the smallest coherent change that addresses the root cause directly.
   - Avoid speculative rewrites or suppressing symptoms (e.g. do not just add `try/catch` without handling the error).
4. **Verify Fix & Guard Against Regression**:
   - Run the reproduction test; verify it now passes.
   - Run the full existing test suite to ensure zero regressions in related modules.

# Decision Tree
```
Encountered Failure
├── Can it be reproduced locally?
│   ├── No ──► Inspect logs/traces, add targeted diagnostic logging, re-run
│   └── Yes ──► Write automated reproduction test
│       ├── Test fails as expected ──► Formulate root-cause hypothesis
│       │   ├── Apply smallest fix to root cause
│       │   ├── Verify reproduction test passes
│       │   └── Run full test suite to guarantee zero regressions
```

# Verification
- Reproduction test fails before fix and passes after fix.
- Full project test suite passes with zero regressions.
- Root cause documented clearly in task evidence.

# References
- [Testing Software Skill](file:///e:/AI%20Engineering%20Workflow/.agents/skills/testing-software/SKILL.md)
- [Verifier Subagent](file:///e:/AI%20Engineering%20Workflow/.agents/agents/verifier.md)
