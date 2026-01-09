# Copilot Contribution Guide

- Run `npm run format` before committing to keep Prettier happy. If commits are not planned, at least run `npm run lint` and fix any reported issues.
- Use spaces instead of tabs; the Prettier defaults in this repo expect two-space indentation.
- Keep documentation updates in sync with sample content under `content/projects/` so references do not drift.
- Coordinate design-system work against the "Foundation Design System (CSS Variables)" milestone; ensure related PRs link the milestone issues and keep `docs/design-system.md` plus the style-guide route current.
- Avoid committing large binary assets; prefer lightweight placeholders and place production-ready images under `static/images/projects/{slug}/`.
- Follow a semantic git flow:
  - Branch off `main` using `issue{number}-short-description`.
  - Keep commits focused and use Conventional Commit prefixes (e.g. `feat:`, `fix:`, `docs:`, `chore:`). When touching content model data, prefer the scoped form (`feat(content): …`).
  - Run `npm run format` before the final commit and ensure `git status` reports a clean tree.
  - Push the branch and open a PR with `Closes #{issue}` plus a concise bullet summary of the change.
  - After merge, delete the branch locally and remotely unless it remains under review.
- Update this guide whenever workflow expectations change so Copilot has clear instructions to follow.
