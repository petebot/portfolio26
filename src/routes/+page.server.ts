import type { PageServerLoad } from './$types';
import { loadPublishedProjects } from '$lib/server/projects';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const projects = (await loadPublishedProjects()).sort((a, b) => {
		if (a.weight !== undefined || b.weight !== undefined) {
			return (a.weight ?? Number.MAX_SAFE_INTEGER) - (b.weight ?? Number.MAX_SAFE_INTEGER);
		}

		return (b.sortDate ?? '').localeCompare(a.sortDate ?? '');
	});

	return {
		projects
	};
};
