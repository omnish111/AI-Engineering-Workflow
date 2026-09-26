# Multidimensional Task Classifier (V3)

## Purpose

Classify incoming engineering tasks across multiple dimensions (domain, activity, risk, scope, parallelizability) to activate the minimum high-signal subagents, skills, and model tiers. This eliminates single-bucket limitations and prevents unnecessary agent sprawl.

## Classification Dimensions

Each task is classified across five orthogonal dimensions:

### 1. Primary Domain
- `frontend`: UI components, styling, client state, browser flows.
- `backend`: Services, business logic, controllers, background workers.
- `fullstack`: Coordinated backend and frontend changes.
- `database`: Schemas, migrations, query optimization, indexes.
- `security`: Authentication, authorization, cryptography, secrets, permissions.
- `devops`: Docker, CI/CD, environments, build pipelines.
- `architecture`: System boundaries, ADRs, module refactoring.

### 2. Activity Type
- `implementation`: Authoring new code or features.
- `bugfix`: Diagnosing and resolving defects or regressions.
- `planning`: Requirements decomposition, task contracts, DAG generation.
- `review`: Evaluating code quality, security, and conventions.
- `evaluation`: Independently assessing actual functional outcomes against acceptance criteria.
- `research`: Investigating technical questions, libraries, or external APIs.

### 3. Risk Level
- `low`: Isolated formatting, doc changes, small CSS tweaks.
- `standard`: Routine feature development, standard CRUD, unit tests.
- `high`: Database migrations, public API changes, major refactors.
- `critical`: Authentication, encryption, payments, data deletion, production config.

### 4. Scope
- `isolated`: Modifies 1–2 files within a single module.
- `modular`: Modifies multiple files within a single subsystem.
- `cross-cutting`: Modifies interfaces across multiple subsystems or shared libraries.

### 5. Parallelizability
- `true`: Task has zero output path conflicts and no semantic dependencies with concurrent tasks.
- `false`: Task modifies shared files, database schemas, or package manifests.

---

## Classification Matrix & Routing Output

| Domain + Activity | Risk Level | Scope | Assigned Roles | Activated Skills | Model Tier |
|-------------------|------------|-------|----------------|------------------|------------|
| `frontend` + `implementation` (simple) | `low` | `isolated` | `implementer`, `verifier` | `implementing-frontend`, `verifying-changes` | `fast` |
| `backend` + `implementation` | `standard` | `modular` | `planner`, `implementer`, `verifier`, `reviewer` | `planning`, `implementing-backend`, `testing-software`, `verifying-changes`, `reviewing-code` | `standard` |
| `any` + `bugfix` | `standard` | `isolated`/`modular` | `debugger`, `implementer`, `verifier` | `debugging-software`, `testing-software`, `verifying-changes` | `standard` |
| `security` + `any` | `critical` | `any` | `planner`, `implementer`, `verifier`, `security-reviewer` | `securing-applications`, `testing-software`, `verifying-changes` | `critical` |
| `architecture` + `planning` | `high` | `cross-cutting` | `planner`, `architect` | `analyzing-prd`, `planning`, `designing-architecture` | `strong` |
| `any` + `evaluation` | `standard` | `any` | `evaluator` | `evaluating-results` | `standard` |

---

## Task Contract Metadata Schema

Tasks stored in `.ai/state/tasks.json` include multidimensional metadata:

```json
{
  "id": "task-auth-001",
  "description": "Implement password reset confirmation endpoint",
  "metadata": {
    "primaryDomain": "backend",
    "activityType": "implementation",
    "riskLevel": "critical",
    "scope": "modular",
    "parallelizable": false
  },
  "role": "implementer",
  "skills": ["implementing-backend", "securing-applications", "verifying-changes"],
  "modelTier": "critical",
  "status": "READY",
  "dependsOn": [],
  "inputs": ["codebase/backend/src/auth/entities/user.entity.ts"],
  "outputs": ["codebase/backend/src/auth/controllers/password-reset.controller.ts"],
  "acceptanceCriteria": [
    "POST /auth/reset-password/confirm with valid token updates password",
    "Single-use token constraint enforced",
    "Weak passwords rejected with 400"
  ]
}
```
