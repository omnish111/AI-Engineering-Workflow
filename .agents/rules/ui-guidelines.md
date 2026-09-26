---
trigger: glob
globs: "**/*.{tsx,jsx,css,html,vue,svelte}"
description: Frontend UI guidelines, visual aesthetics, accessible colors, and state requirements.
---

# UI Guidelines & Visual Invariants

- **Fundamental State Handling**: Every user-facing view, component, or data table must gracefully handle three states: Loading (skeleton/spinner), Empty (clear CTA/explanation), and Error (actionable retry or message).
- **Legible Typography & Contrast**: Ensure paired text and background colors maintain WCAG AA minimum contrast (4.5:1 for normal text). Never produce invisible or low-contrast text.
- **Responsive Layout**: Mobile-first design. All views must render cleanly from 375px (mobile) to 1920px+ (desktop) without overflow or truncated buttons.
- **Design Consistency**: Utilize modern Tailwind CSS / shadcn/ui components. Maintain consistent spacing (multiples of 4px/8px), border radii, and color tokens.
- **Feedback & Micro-interactions**: Provide immediate visual feedback for interactive elements (hover, focus-visible, active, disabled states).
