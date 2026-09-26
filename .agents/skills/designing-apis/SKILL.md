---
name: designing-apis
description: Designs RESTful, GraphQL, or RPC API contracts, validation schemas, error envelopes, pagination patterns, and OpenAPI specs. Use when defining or updating public or internal API interfaces.
---

# Purpose
Create predictable, secure, self-documenting API endpoints with standardized request/response envelopes, robust validation, pagination, and error representations.

# When to Use
- Designing new API routes, endpoints, or microservice contracts.
- Updating API versioning or establishing OpenAPI/Swagger documentation.
- Standardizing pagination, filtering, sorting, or error response formats.

# Procedure
1. **Contract Definition**:
   - Define clean RESTful URI paths (nouns in plural, e.g. `/api/v1/users`, `/api/v1/auth/reset-password`).
   - Use correct HTTP verbs (`GET` for retrieval, `POST` for creation, `PATCH`/`PUT` for updates, `DELETE` for removal).
2. **Standard Response Envelopes**:
   - Success envelope:
     ```json
     {
       "success": true,
       "data": { ... },
       "meta": { "page": 1, "limit": 20, "total": 100 }
     }
     ```
   - Error envelope:
     ```json
     {
       "success": false,
       "error": {
         "code": "VALIDATION_FAILED",
         "message": "Invalid password format",
         "details": [ ... ]
       }
     }
     ```
3. **Pagination & Query Contracts**:
   - Use cursor-based or limit/offset pagination with sensible max limits (e.g. max limit 100).
4. **Validation & Documentation**:
   - Define strict input validation DTOs/schemas.
   - Annotate endpoints with Swagger/OpenAPI decorators or generate schemas automatically.

# Decision Tree
```
API Design
├── Resource collection? ──► GET /resources?page=1&limit=20 ──► Envelope with meta
├── Resource mutation? ──► POST/PATCH/DELETE with DTO validation ──► Success envelope
└── Error occurred? ──► Catch in global filter ──► Return standardized error envelope with appropriate status code
```

# Verification
- All endpoints return standardized success/error JSON envelopes.
- Invalid payloads return `400 Bad Request` with structured field-level error messages.
- OpenAPI/Swagger specifications compile without schema errors.

# References
- [Architecture Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/architecture-rules.md)
- [Coding Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/coding-rules.md)
