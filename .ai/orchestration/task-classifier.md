# Task Classifier

## Purpose

Classify incoming tasks to determine which roles and skills to activate. This replaces the V1 approach of always activating all agents.

## Classification Decision Tree

```
1. Is this a bug report or error investigation?
   YES → Category: bug-fix
   
2. Is this a simple change (< 3 files, no architectural impact)?
   YES → Category: simple-fix

3. Is this a deployment or infrastructure task?
   YES → Category: deployment

4. Is this a code refactor or cleanup?
   YES → Category: refactor

5. Does this require new database schema or API changes?
   YES → Does it affect authentication/authorization?
         YES → Category: security-change
         NO  → Does it require architectural decisions?
               YES → Category: complex-feature
               NO  → Category: feature

6. Is this a new feature with multiple components?
   YES → Does it require both backend AND frontend?
         YES → Category: complex-feature
         NO  → Category: feature

7. Is this only planning/analysis (no code changes)?
   YES → Category: planning

DEFAULT → Category: feature
```

## Signals for Classification

| Signal | Interpretation |
|--------|---------------|
| Bug report file exists | bug-fix |
| Feature spec file exists | feature or complex-feature |
| Only frontend files affected | simple-fix or feature (frontend-only) |
| Only backend files affected | simple-fix or feature (backend-only) |
| Database schema changes | database-change or complex-feature |
| Auth/security mentioned | security-change |
| Docker/CI/CD mentioned | deployment |
| "refactor" or "cleanup" in request | refactor |
| PRD submitted | planning → complex-feature |

## Output

The classifier outputs:
- `taskType`: One of the types from role-registry.json
- `roles`: Ordered list of roles to activate
- `skills`: Skills to load for the task
- `contextFiles`: Files to load (from context-manifest.json)
