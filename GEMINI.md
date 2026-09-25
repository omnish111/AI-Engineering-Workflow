# Google Antigravity Rules

Follow the shared rules defined in [AGENTS.md](AGENTS.md).
Workspace rules are located in `.agents/rules/`.
Skills are located in `.agents/skills/` (adapters pointing to canonical `.ai/skills/[name]/SKILL.md`).

## V2 Skill Loading

Skills use YAML frontmatter with `triggers` to determine when to activate.
Load only the skills relevant to the current task — see `.ai/orchestration/context-manifest.json`.
