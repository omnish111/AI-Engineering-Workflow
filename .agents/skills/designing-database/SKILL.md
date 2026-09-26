---
name: designing-database
description: Designs data models, schemas, indexes, migrations, query optimizations, and data safety constraints. Use when defining schemas, relationships, or executing database migrations.
---

# Purpose
Design consistent, performant, normalized data models, migrations, and indexing strategies with strict data safety protections.

# When to Use
- Adding or modifying database entities, tables, or collections.
- Writing migration scripts or schema transformations.
- Diagnosing slow queries or planning indexing strategies.

# Procedure
1. **Schema Design**:
   - Model entities with clear data types, required fields, default values, and foreign keys / references.
   - Design for primary query access patterns to avoid unindexed table scans.
2. **Index Optimization**:
   - Add compound or unique indexes for high-frequency filter, join, and sort keys.
   - Guard against over-indexing which degrades write throughput.
3. **Migration & Backward Compatibility**:
   - Author reversible migration steps (up/down).
   - Use multi-phase deployments for breaking schema changes:
     1. Add new column/field (nullable or with default)
     2. Dual-write / backfill
     3. Switch readers to new field
     4. Remove old field
4. **Data Safety**:
   - Never run unverified destructive statements (`DROP TABLE`, `DROP DATABASE`, unconstrained `DELETE`).
   - Use soft deletes (`deletedAt: Date | null`) where auditability or recovery is needed.

# Decision Tree
```
Database Modification
├── New field? ──► Make optional/default -> Update schema -> Update seed/fixtures
├── Relational/structural change? ──► Write reversible migration -> Verify index coverage
└── Breaking change? ──► Multi-phase migration -> Prevent downtime or data loss
```

# Verification
- Schema compiles and validates against database driver / ORM types.
- Indexes exist for foreign keys and frequent filter parameters.
- Reversible migration scripts tested on clean local database.

# References
- [Architecture Rules](file:///e:/AI%20Engineering%20Workflow/.agents/rules/architecture-rules.md)
- [Security Invariants](file:///e:/AI%20Engineering%20Workflow/.agents/rules/security.md)
