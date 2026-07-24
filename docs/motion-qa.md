# Expressive motion QA baseline

Verified July 24, 2026 against the local SvelteKit development server.

## Visual states reviewed

- Desktop at 1280 × 720: hero entrance, sticky card overlap, all four reel frames, reel progress, horizontal-blind color wipe, practice grid, and contact block.
- Mobile at 390 × 844: two-row navigation, hero wrapping, non-sticky project cards, scroll reel, color wipe, and single-column practice layout.
- Reduced motion through `?motion=reduce`: entrance and scroll timelines do not initialize, the reel collapses to one viewport, only the first frame remains, and its progress indicator is removed.

## Interaction and layout checks

- `/#work` anchor navigation updates the URL and lands below the sticky header.
- A project detail route loads successfully from the homepage card stack.
- The homepage retains one H1 and ordered project/practice lists with descriptive project links.
- Horizontal overflow is zero at both reviewed viewport sizes.
- No Vite error overlay, console error, or console warning was present during the review.

## Loading and performance notes

- GSAP and ScrollTrigger are dynamically imported by the homepage motion controller.
- Reel imagery uses the existing project archive with lazy loading and async decoding; it adds no new media request to the hero path.
- The production build emits the GSAP-containing shared chunk at roughly 70 KB uncompressed and 28 KB gzip.
- The visual reel uses transforms and opacity only; no canvas render loop or continuous idle animation runs.

## Follow-up boundary

A physical Safari/iOS device sweep belongs with the broader automated testing and visual-preview effort in issue #37. The motion pass itself was reviewed at desktop and mobile breakpoints in the available browser, and its reduced-motion behavior has a repeatable local test URL.
