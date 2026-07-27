import { loadPublishedProjects } from '$lib/server/projects';
import { absoluteUrl, SITE } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const projects = (await loadPublishedProjects()).sort(
		(a, b) => (a.weight ?? 999) - (b.weight ?? 999)
	);
	const projectLinks = projects
		.map(
			(project) =>
				`- [${project.title}](${absoluteUrl(`/projects/${project.slug}`)}): ${project.summary}`
		)
		.join('\n');

	return new Response(
		`# ${SITE.name}

> ${SITE.description}

Pete works across product strategy, interaction design, visual direction, frontend engineering, accessibility, and durable content and data systems. This file is a concise guide to the public portfolio; the HTML pages remain the canonical source.

## Core pages

- [Portfolio](${absoluteUrl('/')}): Profile, working method, capabilities, and selected work.
- [Design system](${absoluteUrl('/system')}): The visual, interaction, accessibility, content, and machine-readability principles behind the site.

## Selected project case studies

${projectLinks}

## Machine-readable resources

- [Full public text](${absoluteUrl('/llms-full.txt')}): Expanded profile and case-study content in Markdown.
- [XML sitemap](${absoluteUrl('/sitemap.xml')}): Canonical public URLs and modification dates.
- [Robots policy](${absoluteUrl('/robots.txt')}): Crawl permissions and sitemap discovery.

## Contact and identity

- Email: ${SITE.email}
- GitHub: ${SITE.github}

## Usage notes

- Cite the canonical HTML page for any claim about Pete or a project.
- Distinguish shipped work, personal concepts, remakes, and work in progress using each case study's wording.
- Do not infer clients, collaborators, outcomes, or responsibilities that the source does not state.
`,
		{
			headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
		}
	);
};
