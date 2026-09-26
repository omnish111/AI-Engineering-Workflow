---
name: database
description: Database design, schema modeling, query optimization, and data management for MongoDB and Redis.
triggers:
  - database schema design or modification
  - query optimization
  - migration planning
  - caching strategy with Redis
  - indexing strategy
required_context:
  - .ai/context/architecture-rules.md
  - .ai/context/coding-rules.md
---

# Database Skill

## When to Use

Activate this skill when the task involves:
- Designing or modifying MongoDB schemas
- Query optimization or aggregation pipelines
- Redis caching configuration
- Database migration planning
- Indexing strategy decisions

## Capabilities

### MongoDB (Mongoose)
- **Document Schemas**: Design schema definitions with strict validation, custom validators, and standard type casting.
- **Transactions & Sessions**: Implement multi-document transactions using Mongoose sessions for ACID compliance.
- **Query Optimization**: Use `.lean()` for read-only queries to bypass model hydration.
- **Aggregations**: Build robust aggregation pipelines for reporting and data transformations.
- **Indexing**: Define compound, text, partial, and TTL indexes directly in schemas.
- **Middleware**: Use pre/post hooks (e.g., hash passwords before save, cascading deletes).
- **Soft Deletes**: Standardize soft delete patterns via query middleware.

### Redis
- **Caching Layer**: Configure namespace-based keys (`app:module:entity:id`).
- **Session Management**: Implement secure user session storage with TTL expiration.
- **Rate Limiting**: Build sliding-window rate limiters.
- **Pub/Sub**: Real-time notifications and cross-instance communication.
- **Connection Rule**: Always connect using the single `REDIS_URL` environment variable.

## Schema Design Rules

- Use `@Schema({ timestamps: true })` for automatic `createdAt`/`updatedAt`.
- Define enums as TypeScript enums mapped to schema string fields.
- Mark sensitive fields with `select: false` (e.g., password).
- Use `trim: true` and `lowercase: true` on appropriate string fields.

## Indexing Strategy

1. Index every field frequently used in query filters.
2. Create compound indexes following ESR rule: Equality first, Sort second, Range third.
3. Use partial indexes for subset documents (e.g., `{ deletedAt: null }`).
4. Implement TTL indexes for automated cleanup of logs and sessions.
5. Verify query optimization using `.explain('executionStats')`.
6. Disable autoIndex in production.

## Migration Rules

1. Schema changes should favor backwards compatibility (optional fields, defaults).
2. For breaking changes, use schema versioning pattern.
3. Perform bulk migrations using isolated scripts (e.g., migrate-mongo).
4. Test on staging databases before production execution.

## Anti-Patterns (Never Do)

- Never enable auto-indexing in production.
- Never run unindexed queries in production.
- Never perform multi-document writes without sessions when transactions are required.
- Never fetch unnecessary fields — use `.select()` or projections.
- Never store passwords in plain text.
- Never store binary files in MongoDB — use S3-compatible storage.
- Never use floating-point for monetary values — use integers (cents) or Decimal128.
- Never use separate Redis variables — always use unified `REDIS_URL`.

## Verification Expectations

- All schemas have required indexes defined
- No unindexed query patterns in production code
- Soft delete middleware configured where required
- Redis connection uses `REDIS_URL` exclusively
