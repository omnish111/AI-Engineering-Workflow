---
trigger: model_decision
description: Conventions for naming files, directories, classes, functions, and database entities.
---

# Naming Conventions

- **Files and Folders**: Use lowercase `kebab-case` for all file and directory names (e.g., `user-profile.controller.ts`, `auth-service.ts`).
- **Classes and Types**: Use `PascalCase` for classes, interfaces, types, and enums (e.g., `UserRepository`, `CreateUserDto`, `UserRole`).
- **Methods and Variables**: Use `camelCase` for functions, methods, and variable names (e.g., `findUserById`, `isValidPassword`).
- **Constants**: Use `UPPER_SNAKE_CASE` for global immutable constants and environment variables (e.g., `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MS`).
- **Database Collections / Tables**: Use plural lowercase or snake_case (e.g., `users`, `password_reset_tokens`).
- **Clear Intent**: Names must be descriptive and pronounceable. Avoid single-letter variable names except in small loop counters (`i`, `j`).
