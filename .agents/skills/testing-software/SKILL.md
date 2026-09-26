---
name: testing-software
description: Authors and runs impact-aware unit, integration, API, and end-to-end (E2E) automated tests. Use when writing tests, verifying bug fixes, or ensuring test coverage.
---

# Purpose
Deliver automated, repeatable, fast test suites covering unit logic, integration points, API behaviors, and end-to-end user journeys without flaky test behaviors.

# When to Use
- Writing tests for newly implemented features or bug fixes (TDD/test-first or alongside code).
- Validating API contracts, repository queries, and service business logic.
- Running regression test suites before task sign-off.

# Procedure
1. **Determine Test Level**:
   - **Unit Tests**: Test pure business logic, utility functions, and domain rules in isolation using mocks or fakes for external I/O.
   - **Integration Tests**: Test repositories against database instances, services with real dependencies, and controller routing.
   - **E2E Tests**: Test complete user flows from entry point to database and back.
2. **Author Test Cases Following AAA Pattern**:
   - **Arrange**: Set up test fixtures, state, and test doubles.
   - **Act**: Execute the target method or endpoint.
   - **Assert**: Verify expected returns, state changes, and side-effects.
3. **Cover Edge Cases & Failure Paths**:
   - Test both happy paths and negative paths (invalid input, unauthorized access, missing entity, expired token).
4. **Execute Tests**:
   - Run tests using the native runner (e.g., `node --test` or `jest`).
   - Confirm tests run cleanly with zero false positives or unhandled rejections.

# Decision Tree
```
Testing Strategy
├── Pure algorithm/helper? ──► Fast unit test (0 external dependencies)
├── Service/Repository interaction? ──► Integration test with test DB/in-memory store
└── User authentication / critical journey? ──► Full E2E flow covering happy path + security edge cases
```

# Verification
- All test suites exit 0 with 100% pass rate.
- Error conditions and boundary assertions explicitly covered.
- Execution completes within acceptable duration limits.

# References
- [Coding Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/coding-rules.md)
- [Verifier Subagent](file:///e:/AI%20Engineering%20Workflow/.agents/agents/verifier.md)
