import type { PageServerLoad } from './$types';
import { loadPublishedProjects } from '$lib/server/projects';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const projects = await loadPublishedProjects();

	return {
		projects
	};
};
