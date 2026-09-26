---
name: onboarding-projects
description: Scans external codebases, extracts architecture, identifies gaps, and embeds portable engineering DNA infrastructure. Use when adopting, scanning, or onboarding an existing project.
---

# Purpose
Scan external legacy or existing repositories, reverse-engineer their architectural conventions, generate health assessments, and stamp portable `.ai/` engineering DNA to make them self-sufficient.

# When to Use
- Adopting an existing repository or codebase into the AI engineering workflow.
- Scanning a codebase to determine technical stack, health score, and modernization roadmap.
- Stamping portable `.ai/` and `AGENTS.md` into external projects via `dna-stamper.js`.

# Procedure
1. **Repository Discovery & Scanning**:
   - Run `node .ai/scripts/project-scanner.js <path>` to scan file structure, package manifests, and tech stack.
   - Detect frameworks, databases, test runners, and entry points.
2. **Health & Architecture Assessment**:
   - Check test coverage, TypeScript strictness, linter setup, and security posture.
   - Generate an onboarding report with health score and prioritized modernization backlog.
3. **Embed Portable Engineering DNA**:
   - Run `node .ai/scripts/dna-stamper.js <target-path>` to stamp self-contained `.ai/`, `AGENTS.md`, and `GEMINI.md`.
   - Ensure the onboarded project is 100% self-sufficient without requiring parent factory links.
4. **Initialize Project State**:
   - Register project in `.ai/projects/` or set up initial `.ai/state/project.json`.

# Decision Tree
```
Onboard Codebase
├── Is target directory valid?
│   ├── No ──► Prompt for valid target path
│   └── Yes ──► Scan repository
│       ├── Generate architecture & health report
│       ├── Run dna-stamper.js to embed portable intelligence
│       └── Output upgrade roadmap
```

# Verification
- Scanner report accurately detects tech stack and frameworks.
- Stamped DNA contains valid, self-contained configuration files.
- Stamped project passes internal validation tests.

# References
- [DNA Stamper Script](file:///e:/AI%20Engineering%20Workflow/.ai/scripts/dna-stamper.js)
- [Project Scanner Script](file:///e:/AI%20Engineering%20Workflow/.ai/scripts/project-scanner.js)
