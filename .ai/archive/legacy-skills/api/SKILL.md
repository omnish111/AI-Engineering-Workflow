---
name: api
description: RESTful API design, versioning, OpenAPI documentation, and contract validation.
triggers:
  - API endpoint design or modification
  - Swagger/OpenAPI documentation
  - API versioning decisions
  - contract testing
required_context:
  - .ai/context/coding-rules.md
  - .ai/context/architecture-rules.md
---

# API Development Skill

## When to Use

Activate this skill when the task involves:
- Designing or modifying RESTful API endpoints
- Swagger/OpenAPI documentation generation
- API versioning decisions
- API contract validation or testing

## Execution Instructions

- Design RESTful APIs following OpenAPI 3.0 specification
- Use versioned endpoints (`/api/v1/*`)
- Add Swagger decorators for automatic documentation
- Implement request validation with `class-validator` and `class-transformer`
- Build response serialization with DTOs
- Follow consistent error response format: `{ statusCode, message, error, timestamp, path }`
- Implement pagination (cursor-based for large datasets)
- Use proper HTTP status codes

## Verification Expectations

- Swagger documentation generates without errors
- All endpoints have proper HTTP status codes
- Request validation catches invalid inputs
- Response DTOs exclude sensitive fields
