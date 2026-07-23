# Pete Nawara — Portfolio

An editorial portfolio for Pete Nawara, a creative technologist working across product thinking, visual direction, and technical execution.

The site is built with SvelteKit and uses a lightweight local content system: structured project metadata in JSON, narrative case studies in Markdown, and project-specific visuals rendered as Svelte components.

## Selected work

- **Synchronic Studio** — local-first creative practice system
- **Let’s Worm** — prompt-driven literary art platform created with writer Dan Murphy
- **Grande Burrito** — brand-led restaurant and content system
- **21GRAMS** — archived immersive agency experience

## Development

```sh
npm install
npm run dev
```

Before opening a pull request, run:

```sh
npm run format
npm run check
npm run build
```

The production build validates project content before compiling the application.

## Project content

Each case study lives in its own folder:

```text
content/projects/{slug}/
├── project.json
└── content.md
```

`project.json` controls title, summary, status, ordering, role, timeframe, technology, and links. `content.md` provides the case-study narrative.

Only records with `status: "published"` appear publicly. Drafts remain available to local editorial tooling but are excluded from the site. Internal fields are removed before project data reaches the client.

See [docs/content-model.md](docs/content-model.md) for the complete schema and visibility rules.

## Deployment

The site is designed for Vercel preview deployments on pull requests and production deployment from `main`. Environment-specific deployment setup should remain outside project content and source-controlled secrets.
