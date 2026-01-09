# Copilot Contribution Guide

- Run `npm run format` before committing to keep Prettier happy. If commits are not planned, at least run `npm run lint` and fix any reported issues.
- Use spaces instead of tabs; the Prettier defaults in this repo expect two-space indentation.
- Keep documentation updates in sync with sample content under `content/projects/` so references do not drift.
- Avoid committing large binary assets; prefer lightweight placeholders and place production-ready images under `static/images/projects/{slug}/`.
- Update this guide whenever workflow expectations change so Copilot has clear instructions to follow.
