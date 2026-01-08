# portfolio26

A SvelteKit project built with `sv`, deployed on Vercel, and backed by a lightweight but intentional CI setup.

This repository is structured to support preview deployments, automated checks, and a clean path to production on `main`.

---

## Tech Stack

- **Framework**: SvelteKit
- **Build Tool**: Vite
- **Formatting**: Prettier (with Svelte support)
- **CI**: GitHub Actions
- **Hosting**: Vercel (Preview + Production)
- **Runtime**: Node.js

---

## Local Development

Install dependencies:
sh npm install
`

Start the dev server:
sh npm run dev
To open the app automatically in a browser tab:
sh npm run dev -- --open
---

## Formatting & Code Style

This project uses **Prettier** for consistent formatting across JavaScript, TypeScript, and Svelte files.

Available scripts:
sh npm run format # formats files in-place npm run lint # checks formatting (used in CI)
Formatting is enforced in CI. If `npm run lint` fails, run `npm run format` locally and commit the result.

---

## CI / Build Checks

This repository includes a GitHub Actions workflow that runs on:

* **Pull requests**
* **Pushes to `main`**

The CI pipeline performs:

* Dependency installation
* Prettier formatting check
* SvelteKit build verification

Pull requests must pass all checks before merging into `main`.

---

## Deployment Strategy

### Preview Deployments

* Every pull request automatically generates a **Vercel Preview Deployment**
* Preview URLs are attached directly to the PR for easy review

### Production Deployment

* Merging into `main` triggers a **production deployment on Vercel**
* `main` is treated as the source of truth for production

---

## Branch & Merge Policy

* All changes are made via pull requests
* CI checks must pass before merge
* Branches are deleted after merge to keep the repo clean

---

## Building for Production

To create a production build locally:
sh npm run build
To preview the production build:
sh npm run preview
---

## Notes

This project intentionally keeps tooling minimal while enforcing:

* Repeatable builds
* Predictable formatting
* Confidence that `main` always deploys cleanly

The goal is clarity over cleverness.
--- ### Why this README works - It documents **decisions**, not just commands - It explains *why* CI exists, not just that it exists - It matches exactly what you just set up, nothing aspirational - It will age well as the project grows
