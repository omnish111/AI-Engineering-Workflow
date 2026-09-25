---
name: testing
description: Automated testing strategies including impact-aware test selection, unit/integration/E2E testing.
triggers:
  - writing or running tests
  - verifying code changes
  - QA review or test planning
  - test coverage analysis
  - regression testing
required_context:
  - .ai/context/coding-rules.md
---

# Testing & Quality Assurance Skill

## When to Use

Activate this skill when the task involves:
- Writing unit, integration, or E2E tests
- Running test suites to verify changes
- Test coverage analysis
- Regression testing after bug fixes
- Impact analysis for test selection

## Impact-Aware Testing (V2)

Before running tests, determine what changed and select tests accordingly:

### Change Impact Analysis
1. **What changed?** → Identify modified files and modules
2. **What modules are affected?** → Trace imports/dependencies
3. **What APIs are affected?** → Check for contract changes
4. **What UI flows are affected?** → Map component usage
5. **What tests are affected?** → Select relevant test files

### Graduated Test Execution
1. **Focused verification first** — Run tests directly related to changed code
2. **Affected integration tests next** — Run tests for dependent modules
3. **Broader tests when required** — Full suite for high-risk or cross-cutting changes

### Risk Assessment for Test Scope
| Change Type | Test Scope |
|-------------|-----------|
| Single component fix | Unit tests for that component |
| API endpoint change | Unit + integration tests for that endpoint |
| Database schema change | Full backend test suite |
| Auth/security change | Full test suite + security tests |
| Cross-cutting concern | Full test suite |
| Dependency update | Full test suite |

## Capabilities

### Unit Testing (Jest)
- Test individual functions, services, and utilities in isolation.
- Mock dependencies using Jest mock functions and factories.
- Test edge cases, error conditions, and boundary values.
- Achieve ≥80% code coverage per module.

### Integration Testing (Supertest)
- Test API endpoints with real database connections.
- Validate request/response schemas against OpenAPI specs.
- Test authentication and authorization flows.
- Verify database state changes after API calls.

### E2E Testing (Playwright)
- Test complete user journeys through the browser.
- Validate responsive layouts across viewports.
- Test form submissions with validation.
- Verify navigation flows and route guards.

### API Testing (Newman/Postman)
- Validate all API endpoints against their contracts.
- Test error handling for invalid inputs.
- Verify rate limiting behavior.
- Test pagination with various parameters.

## Test File Naming

```
Unit:        *.spec.ts        (co-located with source)
Integration: *.e2e-spec.ts    (in tests/integration/)
E2E:         *.spec.ts        (in tests/e2e/)
API:         *.api-spec.ts    (in tests/api/)
```

## Test Structure (AAA Pattern)

```typescript
describe('FeatureService', () => {
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange: Set up test data and mocks
      // Act: Execute the method under test
      // Assert: Verify the expected outcome
    });
  });
});
```

## Coverage Targets

| Type | Minimum | Target |
|------|---------|--------|
| Lines | 80% | 90% |
| Branches | 75% | 85% |
| Functions | 80% | 90% |
| Statements | 80% | 90% |

## Testing Rules

1. Every service method has at least one unit test.
2. Every API endpoint has at least one integration test.
3. Every critical user journey has an E2E test.
4. Tests are independent — no shared state between tests.
5. Tests clean up after themselves (database, files, cache).
6. Test descriptions read like specifications.
7. Mock external dependencies — never call real external services.
8. Use factories for test data creation — no hardcoded test data.

## Verification Expectations

- All tests pass before marking a task complete
- Coverage meets minimum thresholds
- No skipped or commented-out tests
- Test descriptions are clear and specific
