# Design System Overview

This document tracks the "Foundation Design System (CSS Variables)" milestone. The work is split across issues #18–#23 and focuses on:

- Defining CSS custom property tokens for color, typography, spacing, radii, shadows, borders, focus, and layout.
- Applying baseline typography, interactive element styles, and layout primitives across the app using vanilla CSS.
- Meeting WCAG 2.1 AA expectations with explicit focus treatments, reduced-motion support, and high-contrast themes.
- Documenting usage patterns and examples, including a SvelteKit style-guide route for visual regression checks.

Refer to the linked issues for detailed acceptance criteria. Update this document as the system evolves to keep tokens, conventions, and integration steps current.

## Token architecture (issue #18)

All design tokens live in `src/lib/styles/tokens.css`. The file is organised by semantic group so future contributors can reason about the system without additional tooling:

- Palette definitions prefixed with `--color-light-*` and `--color-dark-*` supply accessible color roles for light and dark themes.
- Semantic tokens (e.g. `--color-bg`, `--color-text-muted`, `--color-accent-on`) are the only variables components should consume directly.
- Typography tokens (`--font-family-*`, `--font-size-*`, `--line-height-*`, `--font-weight-*`) assume a 16px root font size and use rem units.
- The spacing scale provides 4px fine control (`--space-1`) with the core 8px grid continuing through `--space-10`.
- Border, radius, shadow, focus, motion, z-index, and container tokens centralise recurring layout values and ensure ADA/WCAG requirements remain intact.

### Light / dark theming

- `:root` defaults to the light palette and declares `color-scheme: light dark` so browsers expose both themes when automatic switching is enabled.
- `@media (prefers-color-scheme: dark)` overrides semantic tokens with the dark palette while respecting user preferences.
- Manual overrides are available via the `.theme-dark`, `.theme-light`, `:root[data-theme="dark"]`, and `:root[data-theme="light"]` selectors. These overrides are CSS-only and can be toggled by applying the class or attribute to `html` or `body`—no JavaScript is required in the MVP.

### Accessibility considerations

- Color pairs are chosen to meet WCAG 2.1 AA contrast ratios (4.5:1 for text, 3:1 for large text and UI controls). If any token combination fails due to future palette adjustments, document the exception and mitigation tactics here.
- Focus styles should consume `--color-focus-ring`, `--focus-ring-width`, and `--focus-ring-offset` to ensure consistent, highly visible outlines across components.
- Motion tokens obey `prefers-reduced-motion`, automatically disabling transitions when users opt out. Components must respect these token values instead of hard-coding durations.

### Usage guidelines

- Import `src/lib/styles/tokens.css` in global styles (issue #23) before consuming tokens in route-level CSS.
- When introducing new tokens, prefer descriptive semantic names over raw values (e.g. `--color-alert-danger` vs `--color-red-500`). Update this document and cross-reference any dependent components or utilities.
- Avoid referencing the raw palette tokens (`--color-light-*`, `--color-dark-*`) outside of the theme management block to keep theme swapping predictable.

## Base element styles (issue #19)

Baseline rules live in `src/lib/styles/base.css` and focus on structural HTML elements. Key decisions:

- `html` and `body` set typography defaults, background/text colors, and font smoothing using tokens so every route inherits the same reading experience.
- Headings map to the typographic scale (`--font-size-800` through `--font-size-200`) with snug line heights; paragraphs, lists, blockquotes, and code snippets use spacing tokens to maintain the 8px rhythm.
- Anchors adopt accent colors with hover and focus treatments driven by the focus ring tokens and `color-mix` to maintain contrast in light and dark modes.
- Inline code and pre blocks rely on mono fonts, surface-muted backgrounds, and radius tokens; blockquotes gain thicker border accents for readability.
- A global `:focus-visible` rule ensures consistent outlines, while the reduced-motion media query clamps transitions and scroll behavior for users who opt out of animation.

Import order matters: load `tokens.css` before `base.css` (handled in issue #23) so variable references resolve correctly. Utility classes and components introduced later should extend rather than reset these foundations.
