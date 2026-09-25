---
name: debugging
description: Systematic debugging, error analysis, and root cause investigation.
triggers:
  - runtime error investigation
  - test failure debugging
  - performance issue diagnosis
  - build or compilation errors
required_context:
  - .ai/context/coding-rules.md
---

# Debugging Skill

## When to Use

Activate this skill when the task involves:
- Investigating runtime errors or crashes
- Debugging failing tests
- Diagnosing performance issues
- Resolving build or compilation errors

## Execution Instructions

1. **Reproduce**: Confirm the error is reproducible
2. **Isolate**: Narrow down the failing component/module
3. **Analyze**: Read error logs, stack traces, and relevant code
4. **Hypothesize**: Form theories about root cause
5. **Test**: Verify hypothesis with targeted debugging
6. **Fix**: Apply minimal, focused correction
7. **Verify**: Confirm fix resolves issue without side effects

## Verification Expectations

- Root cause identified and documented
- Fix is minimal and targeted
- No regression introduced
