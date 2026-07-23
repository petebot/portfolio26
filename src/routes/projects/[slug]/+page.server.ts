import { error, redirect } from '@sveltejs/kit';
import { loadProjectDataset } from '$lib/server/projects';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const dataset = await loadProjectDataset();
	const publishedSlugs = new Set(dataset.published.map((project) => project.slug));
	const aliases = Object.entries(dataset.redirects)
		.filter(([, canonicalSlug]) => publishedSlugs.has(canonicalSlug))
		.map(([slug]) => ({ slug }));

	return [...dataset.published.map(({ slug }) => ({ slug })), ...aliases];
};

export const load: PageServerLoad = async ({ params }) => {
	const dataset = await loadProjectDataset();
	const canonicalSlug = dataset.redirects[params.slug];

	if (canonicalSlug) {
		redirect(308, `/projects/${canonicalSlug}`);
	}

	const projects = dataset.published.slice().sort((a, b) => {
		if (a.weight !== undefined || b.weight !== undefined) {
			return (a.weight ?? Number.MAX_SAFE_INTEGER) - (b.weight ?? Number.MAX_SAFE_INTEGER);
		}

		return (b.sortDate ?? '').localeCompare(a.sortDate ?? '');
	});
	const projectIndex = projects.findIndex((project) => project.slug === params.slug);

	if (projectIndex === -1) {
		error(404, 'Project not found');
	}

	return {
		project: projects[projectIndex],
		nextProject: projects[(projectIndex + 1) % projects.length]
	};
};
