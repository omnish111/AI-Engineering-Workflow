---
name: implementing-backend
description: Implements server-side services, controllers, business logic, entities, and repositories using the project's actual stack. Use when authoring backend code, handlers, or services.
---

# Purpose
Deliver robust, secure, type-safe server-side logic adhering to repository coding standards and architectural layers.

# When to Use
- Writing or updating backend controllers, services, repositories, or background processors.
- Implementing business rules, data pipelines, caching, or third-party integrations.

# Procedure
1. **Context & Type Preparation**:
   - Inspect existing entities, DTOs, and services in `codebase/backend`.
   - Define or verify strongly-typed DTOs with validation decorators or schema validators (e.g. Zod / class-validator).
2. **Implement Repository & Data Access**:
   - Write or update repositories using parameterized queries or ORM/ODM models.
   - Guard against N+1 queries, unindexed lookups, and unhandled null values.
3. **Implement Business Service**:
   - Encapsulate domain rules within injectable services.
   - Use early-return patterns, throw structured domain exceptions, and handle edge cases defensively.
4. **Implement Controller / Handler**:
   - Map routes to service methods. Enforce authorization checks at the endpoint level.
   - Return semantic HTTP status codes (200, 201, 400, 401, 403, 404, 500).
5. **Compile & Self-Check**:
   - Run local typecheck (`tsc --noEmit` or equivalent) to confirm zero compilation errors.

# Decision Tree
```
Backend Implementation
├── New Entity/CRUD? ──► DTO -> Repository -> Service -> Controller
├── Business Logic Change? ──► Inspect existing tests -> Update Service -> Verify contracts
└── Third-Party Integration? ──► Create adapter interface -> Implement client -> Inject into Service
```

# Verification
- Code compiles without TypeScript errors.
- Strict typing enforced (no `any`).
- Proper error handling and status codes on all endpoints.

# References
- [Coding Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/coding-rules.md)
- [Security Invariants](file:///e:/AI%20Engineering%20Workflow/.agents/rules/security.md)
