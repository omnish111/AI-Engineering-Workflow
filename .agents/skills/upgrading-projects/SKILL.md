---
name: upgrading-projects
description: Audits project engineering DNA against modern architectural standards, detects deprecated patterns, and formulates modernization roadmaps. Use when upgrading or modernizing an existing project.
---

# Purpose
Audit existing repositories against modern software engineering standards, identify deprecated libraries, fix broken references, and modernize architectural infrastructure.

# When to Use
- Upgrading a repository to a newer AEW architecture version (e.g. V2 to V3).
- Modernizing deprecated dependencies, old model identifiers, or legacy workflow engines.
- Refactoring projects from legacy pointer stubs to native Antigravity rules and skills.

# Procedure
1. **Audit Existing Architecture**:
   - Compare project configuration (`.ai/settings.json`, `AGENTS.md`, `GEMINI.md`) against latest standards.
   - Scan for deprecated mechanisms:
     - Monolithic legacy workflows (`.agents/workflows` or `.ai/workflows`).
     - Pointer stubs in rules or skills.
     - Outdated model strings in routing configurations.
     - Direct un-synchronized file writes to state.
2. **Formulate Migration Plan**:
   - Generate prioritized migration checklist covering foundation, skills, agents, control plane, security, and evals.
3. **Execute In-Place Modernization**:
   - Upgrade rules to native Antigravity format with triggers and scoping.
   - Convert legacy workflows into progressive-disclosure Agent Skills.
   - Update model routing to abstract capability tiers.
   - Implement atomic state writes and deterministic safety hooks.
4. **Validate & Regress-Test**:
   - Run repository self-validation, regression suites, and outcome-based evals.

# Decision Tree
```
Project Upgrade
├── Is project on legacy architecture?
│   ├── Audit deprecated patterns & broken references
│   ├── Apply in-place upgrades following AEW V3 specification
│   ├── Execute validation & evaluation suites
│   └── Confirm zero regressions and clean architecture
```

# Verification
- All deprecated mechanisms eliminated.
- All references repository-wide resolve cleanly.
- Full validation and evaluation suites pass with zero failures.

# References
- [AGENTS.md Constitution](file:///e:/AI%20Engineering%20Workflow/AGENTS.md)
- [Status Manager](file:///e:/AI%20Engineering%20Workflow/.ai/scripts/status-manager.js)
