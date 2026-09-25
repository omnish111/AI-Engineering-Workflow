---
name: feature-development
description: Incremental feature analysis, planning, implementation, and integration.
triggers:
  - new feature spec created
  - feature addition to existing project
  - PRD updated with new features
required_context:
  - .ai/state/project.json
  - .ai/state/tasks.json
  - .ai/context/architecture-rules.md
---

# Feature Development Skill

## When to Use

Activate this skill when:
- A new feature spec is created under `doc/features/`
- The PRD is updated with additional features
- An incremental feature needs to be added to an existing project

## Execution Instructions

### 1. Ingest Feature Spec
- Read requirements from `doc/features/[feature-name].md`
- Extract use cases, acceptance criteria, and data model changes

### 2. Impact Analysis
- Review existing schemas, database relations, and APIs
- Identify breaking changes
- Determine affected modules and tests

### 3. Task Generation
- Create new tasks in `.ai/state/tasks.json`
- Set correct dependencies on existing tasks
- Assign appropriate roles (may not need all agents)

### 4. Database Migrations (if needed)
- Mongoose: prepare schema updates (backward-compatible)
- Prisma (if SQL): generate migration files

### 5. Implementation
- Execute tasks via appropriate skills (backend, frontend, etc.)
- Follow standard patterns and conventions

### 6. Validation & Integration
- Run impact-aware tests
- Run `node .ai/scripts/validate-project.js`
- Update status logs

## Verification Expectations

- Feature spec requirements fully addressed
- No breaking changes to existing functionality
- All new tests pass
- Integration tests confirm feature works end-to-end
