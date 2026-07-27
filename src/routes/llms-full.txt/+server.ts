import { loadPublishedProjects } from '$lib/server/projects';
import { absoluteUrl, SITE } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const projects = (await loadPublishedProjects()).sort(
		(a, b) => (a.weight ?? 999) - (b.weight ?? 999)
	);
	const caseStudies = projects
		.map((project) => {
			const caseStudyBody = (project.body ?? '').replace(/^# .+\n+/, '').replace(/^## /gm, '#### ');
			const details = [
				project.category && `- Category: ${project.category}`,
				project.role && `- Role: ${project.role}`,
				project.timeframe?.label && `- Timeframe: ${project.timeframe.label}`,
				project.tech?.length && `- Technology: ${project.tech.join(', ')}`,
				`- Canonical page: ${absoluteUrl(`/projects/${project.slug}`)}`,
				project.liveUrl && `- Live project: ${project.liveUrl}`,
				project.repoUrl && `- Source: ${project.repoUrl}`
			]
				.filter(Boolean)
				.join('\n');

			return `### ${project.title}

${project.summary}

${project.intro ?? ''}

${details}

${caseStudyBody}`;
		})
		.join('\n\n---\n\n');

	return new Response(
		`# ${SITE.name} — Creative Technologist

> ${SITE.description}

## Profile

Pete Nawara is a creative technologist interested in useful systems with strong visual character. He moves between product strategy, interaction design, frontend engineering, and the infrastructure that keeps a product working. His recent work includes tools for creative practice, participatory experiences, and small businesses—often taking an idea from a blank page through a functional release.

## Working method

1. Product logic — clarifying the problem, shaping the flow, and deciding what belongs before pixels arrive.
2. Visual direction — building an interface language with a distinct voice, useful hierarchy, and restraint.
3. Technical execution — turning the direction into responsive, accessible software that holds up in use.
4. Durable systems — structuring content, data, and components so the whole system can evolve coherently.

## Contact

- Email: ${SITE.email}
- GitHub: ${SITE.github}
- Canonical portfolio: ${absoluteUrl('/')}

## Selected project case studies

${caseStudies}
`,
		{
			headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
		}
	);
};
