# Google Antigravity Configuration & Runtime Entry Point

This repository uses the native Google Antigravity runtime mechanisms for all engineering workflows.

## Antigravity Native Components

1. **Constitution & Guidelines**: Read and adhere to [AGENTS.md](AGENTS.md).
2. **Persistent Invariants & Constraints**: Located in `.agents/rules/` (`always_on`, `model_decision`, and `glob` triggers).
3. **Execution Capabilities (Agent Skills)**: Located in `.agents/skills/` with canonical `SKILL.md` bundles using progressive disclosure.
4. **Focused Subagents**: Located in `.agents/agents/` for delegated, isolated task execution.
5. **Deterministic Safety Hooks**: Configured in `.agents/hooks.json` to prevent high-blast-radius actions.
6. **AEW Control Plane**: State, routing policies, golden evals, and deterministic support scripts located in `.ai/`.

## Runtime Discovery Notice

Antigravity automatically discovers skills in `.agents/skills/`, subagents in `.agents/agents/`, rules in `.agents/rules/`, and lifecycle hooks in `.agents/hooks.json`. Do not maintain parallel duplicate instructions.
