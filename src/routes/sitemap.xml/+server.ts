import { loadProjectDataset } from '$lib/server/projects';
import { absoluteUrl } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

function escapeXml(value: string) {
	return value.replace(/[<>&'\"]/g, (character) => {
		const entities: Record<string, string> = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			"'": '&apos;',
			'"': '&quot;'
		};
		return entities[character];
	});
}

export const GET: RequestHandler = async () => {
	const dataset = await loadProjectDataset();
	const published = dataset.projects
		.filter((project) => project.status === 'published')
		.sort((a, b) => (a.public.weight ?? 999) - (b.public.weight ?? 999));
	const latestUpdate = published
		.map((project) => project.internal.updatedAt)
		.sort()
		.at(-1);

	const pages = [
		{ url: absoluteUrl('/'), lastModified: latestUpdate, priority: '1.0' },
		{ url: absoluteUrl('/system'), lastModified: latestUpdate, priority: '0.6' },
		...published.map((project) => ({
			url: absoluteUrl(`/projects/${project.slug}`),
			lastModified: project.internal.updatedAt,
			priority: '0.8'
		}))
	];

	const entries = pages
		.map(
			(page) => `  <url>
    <loc>${escapeXml(page.url)}</loc>
    ${page.lastModified ? `<lastmod>${escapeXml(page.lastModified)}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`,
		{
			headers: { 'Content-Type': 'application/xml; charset=utf-8' }
		}
	);
};
