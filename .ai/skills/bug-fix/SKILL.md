---
name: bug-fix
description: Bug investigation, reproduction, fix, and verification workflow.
triggers:
  - bug report filed
  - error investigation
  - hotfix needed
  - regression detected
required_context:
  - .ai/state/project.json
  - .ai/context/coding-rules.md
---

# Bug Fix Skill

## When to Use

Activate this skill when:
- A bug report is filed under `doc/bugs/`
- An error needs investigation and patching
- A hotfix is needed for production
- A regression is detected after a change

## Execution Instructions

### 1. Ingest Bug Report
- Read bug report from `doc/bugs/[bug-name].md`
- Extract: description, reproduction steps, error logs, expected behavior

### 2. Reproduce with Test Case (TDD)
- Write a failing test that reproduces the reported issue
- Confirm the test fails as expected

### 3. Isolate & Fix
- Search the codebase for the offending code
- Make targeted code edits to resolve the root cause
- Keep changes minimal and focused

### 4. Verify Fix
- Run the new test case — confirm it now passes
- Run impact-aware regression tests (see testing skill)

### 5. Validate & Document
- Run `node .ai/scripts/validate-project.js`
- Update task status via `node .ai/scripts/status-manager.js`
- Log resolution details

## Verification Expectations

- Failing test reproduces the bug before fix
- Test passes after fix
- Regression tests pass (no side effects)
- Codebase validation passes
