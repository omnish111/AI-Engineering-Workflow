---
name: upgrade-project
description: Inspects an existing project's embedded engineering DNA, evaluates modern tech stack evolutions, detects architectural drift, and produces prioritized upgrade recommendations.
triggers:
  - upgrade project
  - update project engineering rules
  - refresh project architecture
  - project tech stack upgrade
required_context:
  - .ai/projects/registry.json
---

# Project Upgrade Skill

## When to Use

Activate this skill when:
- An onboarded or previously generated project needs a modern standards refresh.
- New dependencies, frameworks, or best practices have emerged since the project was created.
- The user wants to audit architectural drift between the project's real code and its `.ai/context/` rules.

## Upgrade Workflow

```
1. READ DNA ──► 2. SCAN CODE ──► 3. RESEARCH RECENT EVOLUTIONS ──► 4. GENERATE UPGRADE PLAN ──► 5. APPLY (ON APPROVAL)
```

### Step 1: Read Project DNA
- Open `[targetDir]/.ai/settings.json` and `[targetDir]/.ai/context/architecture.md`.
- Read the last updated date, recorded framework versions, and baseline rules.

### Step 2: Rescan Codebase
- Run `node .ai/scripts/project-scanner.js "[targetDir]"`
- Detect any new packages installed, deprecated libraries, or schema changes made outside of AI governance.

### Step 3: Research Modern Evolutions
- Run targeted web research on:
  - Framework upgrades (e.g. Next.js major version breaking changes & performance features)
  - Security vulnerabilities in pinned dependencies (`npm audit` or equivalent)
  - Newer UI component libraries or performance optimizations

### Step 4: Generate Upgrade Proposal
Create `[targetDir]/.ai/improvements/upgrade-proposal.md`:
- **Core Dependency Upgrades**: Package versions to bump, breaking change risk, and migration steps.
- **Rule & Context Sync**: Updates to `AGENTS.md` and `.ai/context/architecture.md` to reflect new patterns.
- **Performance & Security Recommendations**: Specific optimizations (image optimization, caching, query indexing).

### Step 5: Execute Upon Approval
- After the user approves the upgrade plan, apply the approved changes and update `[targetDir]/.ai/state/decisions.json`.
