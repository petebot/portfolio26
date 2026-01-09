# Portfolio Content Model — Projects (MVP)

This document defines the **MVP content model** for the portfolio’s primary content type: **projects**.

The model is intentionally:

- Storage-agnostic
- Framework-agnostic
- Simple enough to evolve without migration pain

It is designed to support SvelteKit routing, portfolio listings, and detailed project pages without committing to a CMS or implementation strategy.

---

## Overview

- **Primary content type:** project
- **Purpose:** Drive routing, layouts, lists, SEO, and detail views
- **Scope:** MVP foundation (not final or over-optimized)
- **Routing:** Based on `slug` (`/projects/:slug`)

---

## Content storage (MVP)

- **Hybrid format:** JSON metadata plus Markdown body keeps structure machine-readable while leaving longform content author-friendly.
- **Directory layout:**

  ```
  content/
    projects/
      {slug}/
        project.json   # Metadata matching the model
        content.md     # Longform Markdown body
  static/
    images/
      projects/
        {slug}/        # Public image assets (referenced by URL paths)
  ```

- **Linking content:** `contentUri` points to the Markdown file path (e.g. `content/projects/{slug}/content.md`).
- **Image references:** `heroImage` and any gallery assets reference project-local files (for example `./assets/hero.jpg`). A build step or bundler import can publish these alongside static output when routes are implemented.
- **Extensibility:** Structure mirrors CMS-friendly fields, easing future migrations without reworking the codebase.
- **Examples in repo:** See `content/projects/21grams/` and `content/projects/synchronic-studio/` for populated samples that mirror the MVP model.

---

## Sample dataset

```
content/
  projects/
    21grams/
      project.json
      content.md
        assets/
          hero.jpg
    synchronic-studio/
      project.json
      content.md
        assets/
          hero.jpg
```

---

## Identity & slug rules (MVP)

- **Primary key:** `id` is immutable once assigned. Prefer the format `proj-{slug}` or a short UUID so the value stays predictable in version control and future CMS migrations.
- **Canonical URL:** `slug` is the only string used in routes. It must stay unique across all published and draft projects.
- **Slug format:** lowercase, hyphen-delimited, no special characters beyond `[a-z0-9-]`. Mint it alongside the project and adjust manually when the title changes for readability.
- **Slug changes:** Avoid when possible. If a change is necessary, keep the old value inside the `aliases` array so redirects remain possible.
- **Aliases:** Optional array of previous slugs stored with the record. They never appear in listings; they exist solely to detect incoming requests that should redirect to the canonical slug.
- **Collision checks:** Build-time tooling should assert that `slug` values are unique and that no alias duplicates a current slug.

---

## Routing contract

- **Listing page:** `/projects` reads all published `project.json` files (via `import.meta.glob`) and renders cards sorted by `sortDate` or `weight` when defined.
- **Detail route:** `/projects/{slug}` loads a matching `project.json` plus its `content.md`. If the slug is not found, but appears in an `aliases` array, respond with a permanent redirect to the canonical slug.
- **Layouts:** `src/routes/+layout.svelte` remains responsible for shared chrome. A dedicated `src/routes/projects/+layout.ts` can preload the project manifest so child pages reuse the data.
- **Static builds:** Because data lives in the repo, routing works identically for local previews, Vite static adapter output, and Vercel deployments.
- **Future sections:** Additional collections (experiments, writing) should mirror this pattern: immutable `id`, canonical `slug`, optional `aliases`, and a dedicated directory under `content/`.

---

## Core Fields

| Field     | Type   | Required | Visibility | Rationale                                                                      |
| --------- | ------ | :------: | :--------: | ------------------------------------------------------------------------------ |
| id        | string |    ✔     |  Internal  | Stable, immutable identifier (UUID or similar). Used for references, not URLs. |
| slug      | string |    ✔     |   Public   | URL-safe unique identifier used for routing.                                   |
| title     | string |    ✔     |   Public   | Human-readable project title.                                                  |
| summary   | string |    ✔     |   Public   | One-line description for listings, previews, and SEO fallbacks.                |
| status    | enum   |    ✔     |  Internal  | draft, published, archived. Controls visibility and routing.                   |
| createdAt | date   |    ✔     |  Internal  | Record creation timestamp.                                                     |
| updatedAt | date   |    ✔     |  Internal  | Record last-modified timestamp.                                                |

---

## Content & Presentation

| Field      | Type          | Required | Visibility | Rationale                                                                                  |
| ---------- | ------------- | :------: | :--------: | ------------------------------------------------------------------------------------------ |
| intro      | string        | Optional |   Public   | Short introductory paragraph for the project page.                                         |
| contentUri | string        | Optional |  Internal  | Pointer to long-form content (e.g. Markdown file path). Preferred over embedding content.  |
| body       | string        | Optional |   Public   | Inline long-form content (Markdown/HTML). Use sparingly; choose either body or contentUri. |
| heroImage  | object        | Optional |   Public   | Primary image object: url, alt, caption (optional).                                        |
| gallery    | array<object> | Optional |   Public   | Additional project images using the same image object shape.                               |

---

## Discovery & Organization

| Field    | Type          | Required | Visibility | Rationale                                                   |
| -------- | ------------- | :------: | :--------: | ----------------------------------------------------------- |
| tags     | array<string> | Optional |   Public   | Lightweight filtering and discovery.                        |
| category | string        | Optional |   Public   | Single high-level grouping (e.g. product, visual, tooling). |
| tech     | array<string> | Optional |   Public   | Technologies used; useful for filtering and display.        |
| featured | boolean       | Optional |   Public   | Highlight on home or featured lists.                        |
| weight   | number        | Optional |   Public   | Manual ordering priority (lower = earlier).                 |
| sortDate | date          | Optional |   Public   | Canonical date for ordering projects in lists.              |

---

## Attribution & Context

| Field              | Type          | Required | Visibility | Rationale                                             |
| ------------------ | ------------- | :------: | :--------: | ----------------------------------------------------- |
| role               | string        | Optional |   Public   | Your role on the project (e.g. designer, engineer).   |
| collaborators      | array<object> | Optional |   Public   | name, role, and optional URL for contributor credits. |
| clientPublicName   | string        | Optional |   Public   | Client name safe to display publicly.                 |
| clientInternalName | string        | Optional |  Internal  | Internal or legal client reference.                   |
| timeframe          | object        | Optional |   Public   | start, end, and/or label for human-friendly display.  |

---

## Links & SEO

| Field     | Type   | Required | Visibility | Rationale                                 |
| --------- | ------ | :------: | :--------: | ----------------------------------------- |
| liveUrl   | url    | Optional |   Public   | Live demo or deployed project.            |
| repoUrl   | url    | Optional |   Public   | Source repository (if public).            |
| canonical | url    | Optional |   Public   | Canonical URL for SEO.                    |
| seo       | object | Optional |   Public   | SEO overrides: title, description, image. |

---

## Internal-Only Metadata

| Field         | Type          | Required | Visibility | Rationale                                                       |
| ------------- | ------------- | :------: | :--------: | --------------------------------------------------------------- |
| internalNotes | string        | Optional |  Internal  | Editorial notes, migration hints, or reminders.                 |
| metadata      | object        | Optional |  Internal  | Arbitrary internal metadata (sync IDs, import provenance).      |
| aliases       | array<string> | Optional |  Internal  | Historical slugs used to issue redirects to the canonical slug. |

---

## Example Project Record

````{
      "id": "proj-minimal-design-system",
      "slug": "minimal-design-system",
      "aliases": ["minimal-design-library"],
      "title": "Minimal Design System",
      "summary": "A compact, accessible design system for small teams.",
      "status": "published",
      "createdAt": "2024-08-01T12:00:00Z",
      "updatedAt": "2024-10-03T09:30:00Z",
      "sortDate": "2024-08-15",
      "featured": true,
      "category": "product",
      "tags": ["design-system", "accessibility"],
      "tech": ["SvelteKit", "TypeScript"],
      "role": "engineer/designer",
      "timeframe": {
        "label": "Spring 2024"
      },
      "heroImage": {
        "url": "/images/projects/minimal-design-system/hero.jpg",
        "alt": "Design tokens and components"
      },
      "gallery": [
        { "url": "/images/projects/minimal-design-system/1.png", "alt": "Component grid" }
      ],
      "liveUrl": "https://example.com/minimal",
      "repoUrl": "https://github.com/example/minimal-design-system",
      "contentUri": "content/projects/minimal-design-system/content.md"
    }```

---

## Open Questions / Deferred Decisions

- Localization strategy (duplicate records vs field-level translations)
- Structured content blocks vs Markdown
- Image hosting and transformation strategy
- Versioning and draft workflows
- Whether collaborators should evolve into a first-class author model

These are intentionally deferred until real constraints emerge.

---

## Status

This model is **approved for MVP use** and may evolve incrementally as the portfolio grows.
````
