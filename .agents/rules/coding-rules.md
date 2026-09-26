---
trigger: always_on
description: Core engineering coding invariants and TypeScript standards.
---

# Core Coding Rules

- **Strict Type Safety**: TypeScript must run in strict mode. Never use `any`; use `unknown` with type narrowing when types are truly dynamic.
- **Defensive Engineering**: Always handle the three fundamental application states: Loading, Empty, and Error. Never assume API or external data exists without validation (`data?.items ?? []`).
- **Function Boundaries**: Single responsibility principle. Keep functions focused (<= 30 lines preferred). Maximum 4 parameters; pass an options object if more are needed.
- **Async Safety**: Always use `async`/`await`. Avoid unhandled Promise rejections and never mix callbacks with Promises.
- **Early Return Pattern**: Validate preconditions and handle error cases at the start of functions to reduce nesting.
- **Immutability by Default**: Use `readonly` and `const` for data structures unless mutation is explicitly required for performance.
- **Zero Silly Bugs**: Never output code with obvious runtime crashes (`Cannot read property of undefined`, broken imports, missing required props).
