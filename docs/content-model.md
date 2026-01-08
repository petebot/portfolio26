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

| Field         | Type   | Required | Visibility | Rationale                                                  |
| ------------- | ------ | :------: | :--------: | ---------------------------------------------------------- |
| internalNotes | string | Optional |  Internal  | Editorial notes, migration hints, or reminders.            |
| metadata      | object | Optional |  Internal  | Arbitrary internal metadata (sync IDs, import provenance). |

---

## Example Project Record

````{
      "id": "proj-001",
      "slug": "minimal-design-system",
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
      "contentUri": "content/projects/minimal-design-system.md"
    }```

---

## Open Questions / Deferred Decisions

- Localization strategy (duplicate records vs field-level translations)
- Structured content blocks vs Markdown
- Image hosting and transformation strategy
- Slug generation and uniqueness enforcement
- Versioning and draft workflows
- Whether collaborators should evolve into a first-class author model

These are intentionally deferred until real constraints emerge.

---

## Status

This model is **approved for MVP use** and may evolve incrementally as the portfolio grows.
````
