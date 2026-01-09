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

## Layout primitives (issue #20)

Core layout helpers live in `src/lib/styles/layout.css` and provide predictable spacing without extra tooling:

- `.container` constrains content to the `--container-content` width with responsive inline padding. A `data-width` attribute switches to `compact` or `wide` container tokens as needed.
- `.section` sets vertical rhythm. Combine with `.section--contained` for in-flow sections or `.section--bleed` to span edge-to-edge while maintaining safe inline padding. Surface variants supply neutral background panels via design tokens.
- `.stack` arranges children vertically with a configurable gap (default `--space-4`). Use `data-gap="tight"|"loose"` for common variations and `data-align="center"` when aligning content.
- `.cluster` handles horizontal groups (e.g., pill lists or action bars) with wrapping support. Alignment and spacing rely on custom properties so components can override without new class names.
- `.grid` creates responsive grids using intrinsic column sizing (`auto-fit` + `minmax`). Data attributes configure gap density, minimum column width, or force fixed column counts on larger breakpoints.

Accessibility guidance:

- Ensure interactive clusters maintain minimum touch targets; adjust `--cluster-gap` if new components require larger hit areas.
- When using `.section--bleed`, verify focus outlines and skip links remain visible against alternate backgrounds.
- `.grid[data-columns]` falls back to auto-fit columns below 40rem to avoid forcing cramped layouts.

## Accessibility baseline (issue #21)

### Focus and keyboard navigation

- Global `:focus-visible` rules already consume the focus ring tokens from `tokens.css`. When creating new components, avoid resetting outlines; layer visual affordances in addition to the token-driven outline.
- `src/lib/styles/a11y.css` introduces a `.skip-link` helper that appears on focus, letting keyboard users jump directly to the main region.
- `.visually-hidden` and `.visually-hidden-focusable` utilities support screen-reader-only copy while still enabling focusable controls (e.g., skip links or descriptive labels).

### Skip link integration

- `src/routes/+layout.svelte` now renders the skip link before the main content and wraps route output in `<main id="main-content" tabindex="-1">…</main>` so the link target becomes focusable.
- The skip link uses CSS custom properties with fallbacks to remain visible even before tokens are imported globally. Once issue #23 lands, the tokens will control its theming.

### Color contrast snapshot (WCAG 2.1 AA)

| Token pairing                               | Light theme ratio | Dark theme ratio |
| ------------------------------------------- | ----------------- | ---------------- |
| `--color-text` on `--color-bg`              | ≈ 12.4:1          | ≈ 13.6:1         |
| `--color-text-muted` on `--color-bg-subtle` | ≈ 5.8:1           | ≈ 5.2:1          |
| `--color-accent-on` on `--color-accent`     | ≈ 5.6:1           | ≈ 4.9:1          |
| `--color-danger` on `--color-surface`       | ≈ 4.8:1           | ≈ 4.7:1          |

Ratios were validated with the W3C contrast calculator. Document any exceptions alongside mitigations (e.g., bold weight, larger font size) if future palette tweaks lower a pairing below AA.

### Reduced motion and interaction guidance

- Motion tokens respond to `prefers-reduced-motion`, dropping transition durations to `0ms`. New animations should reference the shared tokens instead of hard-coded values.
- Maintain logical tab order when introducing layout-utility wrappers. Use `.stack` and `.cluster` for visual grouping, not to reorder DOM elements.

### Checklist

- [ ] Focus outlines remain visible on all interactives against light and dark backgrounds.
- [ ] Skip link is present, keyboard reachable, and returns focus to `main`.
- [ ] Contrast ratios for text, icons, and interactive states meet WCAG 2.1 AA.
- [ ] Reduced-motion preference disables nonessential animation.
- [ ] Screen-reader-only content uses `.visually-hidden` helpers instead of `display: none;`.

## Buttons and form controls (issue #22)

Component styles live in `src/lib/styles/controls.css` and apply to both semantic elements and utility classes:

- `.button` is the base class for buttons and anchor buttons. It uses accent tokens by default, supports `data-variant="secondary" | "ghost" | "danger"`, and honours `data-size="sm" | "lg"` for padding tweaks. Disabled states (`disabled` or `aria-disabled="true"`) neutralise shadows and pointer events while retaining sufficient contrast.
- Focus states lean on the global `:focus-visible` outline and also adjust `border-color` so buttons and links remain obvious against themed backgrounds.
- `.form-control` can wrap non-semantic inputs, while native `input`, `textarea`, and `select` elements share the same padding, radius, and transition properties. `aria-invalid="true"` or `data-state="error"` flips borders to the danger token, and `data-state="success"` highlights success feedback.
- Selects remove default arrows and replace them with a token-driven caret so light/dark modes stay consistent. Disabled controls dim via `--color-bg-subtle` and `--color-text-muted` without sacrificing readability.
- `.form-message` communicates supporting text or validation copy with matching `data-variant` shades.

Usage notes:

- Always specify a native `type` attribute on `<button>` elements to avoid unintended form submission.
- When displaying validation errors, pair `aria-invalid="true"` on the control with an `aria-describedby` reference to a `.form-message` element to announce contextually.
- Rely on the shared transition tokens; additional component-level animations must respect `prefers-reduced-motion` just as the base implementations do.
