---
name: backend
description: NestJS, Node.js, and TypeScript backend development conventions and patterns.
triggers:
  - backend tasks or API development
  - NestJS module scaffolding
  - authentication/authorization implementation
  - database operations (Mongoose)
  - background job processing (BullMQ)
  - caching with Redis
required_context:
  - .ai/context/coding-rules.md
  - .ai/context/architecture-rules.md
  - .ai/context/tech-stack.md
---

# Backend Development Skill

## When to Use

Activate this skill when the task involves:
- Implementing or modifying NestJS backend modules
- API endpoint development or changes
- Authentication/authorization work
- Database schema or query changes
- Background job processing
- Caching strategy implementation

## Capabilities

### NestJS Application Development
- Scaffold NestJS modules, controllers, services, and schemas/repositories.
- Implement dependency injection with the NestJS IoC container.
- Configure middleware, guards, pipes, interceptors, and exception filters.
- Build modular monolith architecture with clear domain boundaries.

### API Development
- Design and implement RESTful APIs following OpenAPI 3.0 specification.
- Implement versioned endpoints (`/api/v1/*`).
- Add Swagger decorators for automatic documentation generation.
- Implement request validation with `class-validator` and `class-transformer`.
- Build response serialization with DTOs.

### Authentication & Authorization
- Implement JWT-based authentication with access/refresh token rotation.
- Build RBAC (Role-Based Access Control) with custom guards.
- Implement OAuth2 social login integrations.
- Build password hashing with bcrypt (12+ salt rounds).
- Implement rate limiting with `@nestjs/throttler`.

### Database Operations (MongoDB/Mongoose)
- Configure Mongoose for MongoDB with strict schema validation.
- Implement repository pattern for data access abstraction using Mongoose models.
- Build cursor-based pagination for large datasets using MongoDB queries.
- Write complex queries using aggregation pipelines.
- Use transactions and sessions for multi-document operations.

### Background Processing
- Configure BullMQ queues, workers, and processors.
- Implement job scheduling with `@nestjs/schedule`.
- Build event-driven communication between modules.
- Handle job retries, backoff, and failed job queueing.

### Caching & Session Storage (Redis)
- Configure Redis for session management and data caching.
- Implement cache invalidation strategies (write-through/cache-aside).
- Build rate limiting with Redis sliding window.
- Use Redis Streams for real-time features.
- Connect to Redis/BullMQ using the unified `REDIS_URL` environment variable.

## Patterns

### Module Pattern
Every feature is a self-contained NestJS module with:
- Controller (HTTP layer)
- Service (business logic)
- Schema (Mongoose definitions)
- DTOs (input validation + response serialization)
- Constants (module-specific constants)
- Module definition (wiring)

### Error Handling Pattern
- Use NestJS built-in HTTP exceptions (NotFoundException, ConflictException, etc.)
- Implement global exception filter for unhandled errors
- Return consistent error response format: `{ statusCode, message, error, timestamp, path }`
- Log errors with context (module, method, user, request ID)

### Security Pattern
- Validate all inputs at the controller level with class-validator
- Sanitize outputs through DTOs — never expose internal fields
- Use parameterized/escaped queries in MongoDB to prevent NoSQL injection
- Implement request size limits
- Use CORS with explicit origin whitelist
- Enable helmet for HTTP security headers

## Anti-Patterns (Never Do)

- Never put business logic in controllers — controllers delegate to services.
- Never use `any` type — always define proper TypeScript interfaces.
- Never enable Mongoose `autoIndex` in production configurations.
- Never hardcode secrets — use environment variables with `@nestjs/config`.
- Never log sensitive data (passwords, tokens, PII).
- Never use `*` for CORS origins in production.
- Never skip input validation on any endpoint.
- Never use separate `REDIS_HOST`, `REDIS_PORT`, or `REDIS_PASSWORD` variables — always connect via the unified `REDIS_URL` connection string.

## Verification Expectations

- All NestJS modules compile without errors
- Swagger documentation generated for every endpoint
- Unit tests pass for all service methods
- Integration tests pass for all API endpoints
- No `any` types in production code
- Repository pattern enforced (no direct Mongoose calls in services)
