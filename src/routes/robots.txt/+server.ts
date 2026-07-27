import { absoluteUrl } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(
		`User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`,
		{
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		}
	);
