<script lang="ts">
	import ProjectScreenshot from '$lib/components/ProjectScreenshot.svelte';
	import DesignSystemStory from '$lib/components/DesignSystemStory.svelte';
	import { absoluteUrl, SITE } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Section = { heading: string; paragraphs: string[]; items: string[] };

	function parseSections(markdown: string): Section[] {
		const lines = markdown.split('\n');
		const sections: Section[] = [];
		let current: Section | null = null;
		let paragraph: string[] = [];

		const flushParagraph = () => {
			if (current && paragraph.length > 0) {
				current.paragraphs.push(paragraph.join(' '));
				paragraph = [];
			}
		};

		for (const rawLine of lines) {
			const line = rawLine.trim();

			if (line.startsWith('# ')) continue;

			if (line.startsWith('## ')) {
				flushParagraph();
				current = { heading: line.slice(3), paragraphs: [], items: [] };
				sections.push(current);
				continue;
			}

			if (!current) continue;

			if (line.startsWith('- ')) {
				flushParagraph();
				current.items.push(line.slice(2));
			} else if (line.length === 0) {
				flushParagraph();
			} else {
				paragraph.push(line);
			}
		}

		flushParagraph();
		return sections;
	}

	function displayHost(url?: string): string | undefined {
		if (!url) return undefined;

		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return undefined;
		}
	}

	const sections = $derived(parseSections(data.project.body ?? ''));
	const homeUrl = absoluteUrl('/');
	const canonicalUrl = $derived(
		data.project.canonical ?? absoluteUrl(`/projects/${data.project.slug}`)
	);
	const pageTitle = $derived(`${data.project.title} — ${SITE.name}`);
	const liveSiteHost = $derived(displayHost(data.project.liveUrl));
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CreativeWork',
				'@id': `${canonicalUrl}#project`,
				url: canonicalUrl,
				name: data.project.title,
				description: data.project.summary,
				abstract: data.project.intro,
				genre: data.project.category,
				keywords: [...(data.project.tags ?? []), ...(data.project.tech ?? [])],
				image: data.project.heroImage?.url ? absoluteUrl(data.project.heroImage.url) : undefined,
				creator: {
					'@type': 'Person',
					'@id': `${homeUrl}#pete-nawara`,
					name: SITE.name,
					url: homeUrl
				},
				isPartOf: { '@id': `${homeUrl}#website` },
				mainEntityOfPage: canonicalUrl,
				sameAs: [data.project.liveUrl, data.project.repoUrl].filter(Boolean)
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Selected work',
						item: `${homeUrl}#work`
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: data.project.title,
						item: canonicalUrl
					}
				]
			}
		]
	});
	const structuredDataHtml = $derived(
		'<script type="application/ld+json">' +
			JSON.stringify(structuredData).replace(/</g, '\\u003c') +
			'<' +
			'/script>'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={data.project.summary} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={data.project.summary} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={data.project.summary} />
	{@html structuredDataHtml}
</svelte:head>

<article>
	<header class="project-hero">
		<a class="back-link" href="/#work">← Selected work</a>
		<p class="category">{data.project.category}</p>
		<h1>{data.project.title}</h1>
		<p class="intro">{data.project.intro}</p>

		{#if data.project.liveUrl || data.project.repoUrl}
			<nav class="project-actions" aria-label={`${data.project.title} project links`}>
				{#if data.project.liveUrl}
					<a
						class="project-action project-action--live"
						href={data.project.liveUrl}
						rel="noopener noreferrer"
						target="_blank"
						aria-label={`Visit the ${data.project.title} live site (opens in a new tab)`}
					>
						<span class="project-action__label">Hosted project</span>
						<strong>Visit the live site</strong>
						<i aria-hidden="true">↗</i>
					</a>
				{/if}
				{#if data.project.repoUrl}
					<a
						class="project-action project-action--repo"
						href={data.project.repoUrl}
						rel="noopener noreferrer"
						target="_blank"
						aria-label={`View the ${data.project.title} repository (opens in a new tab)`}
					>
						<span class="project-action__label">Source code</span>
						<strong>View the repository</strong>
						<i aria-hidden="true">↗</i>
					</a>
				{/if}
			</nav>
		{/if}

		<dl>
			<div>
				<dt>Role</dt>
				<dd>{data.project.role}</dd>
			</div>
			<div>
				<dt>When</dt>
				<dd>{data.project.timeframe?.label}</dd>
			</div>
			<div>
				<dt>Built with</dt>
				<dd>{data.project.tech?.join(' · ')}</dd>
			</div>
		</dl>
	</header>

	<figure class="visual-wrap">
		<figcaption class="visual-rail">
			<div class="visual-caption">
				<span>Product screenshot</span>
				<span>Static preview</span>
			</div>
			{#if data.project.liveUrl}
				<a
					href={data.project.liveUrl}
					rel="noopener noreferrer"
					target="_blank"
					aria-label={`Open the ${data.project.title} live site (opens in a new tab)`}
				>
					Open live site <span aria-hidden="true">↗</span>
				</a>
			{/if}
		</figcaption>
		<ProjectScreenshot
			slug={data.project.slug}
			image={data.project.heroImage}
			frame="browser"
			frameLabel={liveSiteHost ?? data.project.title}
			cursorLabel="Static preview"
		/>
	</figure>

	<div class="case-study">
		{#each sections as section, index}
			<section>
				<div class="section-index">0{index + 1}</div>
				<h2>{section.heading}</h2>
				<div class="section-content">
					{#each section.paragraphs as paragraph}
						<p>{paragraph}</p>
					{/each}
					{#if section.items.length > 0}
						<ul>
							{#each section.items as item}
								<li>{item}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</section>
		{/each}
	</div>

	{#if data.project.designSystem}
		<DesignSystemStory system={data.project.designSystem} />
	{/if}

	<a class="next-project" href={`/projects/${data.nextProject.slug}`}>
		<span>Next project</span>
		<strong>{data.nextProject.title}</strong>
		<i aria-hidden="true">↗</i>
	</a>
</article>

<style>
	.project-hero,
	.visual-wrap,
	.case-study,
	.next-project {
		width: min(100% - 2rem, 94rem);
		margin-inline: auto;
	}

	.project-hero {
		padding-block: clamp(3rem, 8vw, 7rem) 2rem;
	}

	.back-link,
	.category,
	dt,
	.section-index,
	.project-action__label,
	.next-project > span {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		min-height: var(--target-size-min);
		margin-bottom: clamp(4rem, 8vw, 7rem);
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.back-link:hover,
	.back-link:focus-visible {
		color: var(--color-accent);
		background: transparent;
	}

	.category {
		color: var(--color-accent);
	}

	h1 {
		max-width: 76rem;
		font-size: clamp(4rem, 9vw, 9rem);
		line-height: 0.9;
		letter-spacing: -0.07em;
	}

	.intro {
		max-width: 50rem;
		margin: clamp(2rem, 5vw, 4rem) 0;
		font-size: clamp(1.3rem, 2.4vw, 2.25rem);
		line-height: 1.16;
		letter-spacing: -0.035em;
	}

	.project-actions {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(17rem, 0.75fr);
		gap: clamp(0.75rem, 1.5vw, 1.25rem);
		margin-block: clamp(2.5rem, 5vw, 4.5rem);
	}

	.project-actions:has(.project-action:only-child) {
		grid-template-columns: minmax(0, 1fr);
	}

	.project-action {
		position: relative;
		display: flex;
		min-height: clamp(8rem, 13vw, 11rem);
		flex-direction: column;
		justify-content: space-between;
		gap: 2rem;
		padding: clamp(1.25rem, 2.5vw, 2rem);
		border: var(--border-width-structure) solid var(--color-border);
		color: var(--color-text);
		text-decoration: none;
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			color 180ms ease,
			transform 180ms ease;
	}

	.project-action--live {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: var(--color-accent-on);
	}

	.project-action--repo {
		background: var(--color-surface-muted);
	}

	.project-action__label {
		padding-right: 3rem;
		opacity: 0.78;
	}

	.project-action strong {
		max-width: 80%;
		font-size: clamp(1.55rem, 3.2vw, 2.8rem);
		line-height: 0.98;
		letter-spacing: -0.045em;
	}

	.project-action i {
		position: absolute;
		top: clamp(1.15rem, 2.5vw, 1.9rem);
		right: clamp(1.15rem, 2.5vw, 1.9rem);
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-style: normal;
		transition: transform 180ms ease;
	}

	.project-action:hover,
	.project-action:focus-visible {
		background: var(--color-text);
		border-color: var(--color-text);
		color: var(--color-bg);
		transform: translateY(-0.2rem);
	}

	.project-action:hover i,
	.project-action:focus-visible i {
		transform: translate(0.25rem, -0.25rem);
	}

	dl {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr;
		gap: 2rem;
		margin: 0;
		padding-top: 1rem;
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	dt {
		margin-bottom: 0.65rem;
		color: var(--color-text-muted);
	}

	dd {
		margin: 0;
		font-size: 1rem;
	}

	.visual-wrap {
		width: min(calc(100% - clamp(2rem, 8vw, 8rem)), 72rem);
		margin-bottom: 0;
	}

	.visual-rail {
		display: flex;
		min-height: var(--target-size-min);
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-top: var(--border-width-structure) solid var(--color-border);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.visual-caption {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	.visual-caption span:first-child {
		color: var(--color-accent);
	}

	.visual-caption span:last-child {
		color: var(--color-text-muted);
	}

	.visual-caption span:last-child::before {
		content: '·';
		margin-right: 0.65rem;
	}

	.visual-rail a {
		display: inline-flex;
		min-height: var(--target-size-min);
		align-items: center;
		gap: 0.4rem;
		color: var(--color-text);
		text-decoration: none;
	}

	.visual-rail a:hover,
	.visual-rail a:focus-visible {
		color: var(--color-accent);
		background: transparent;
	}

	.case-study {
		padding-block: clamp(5rem, 11vw, 10rem);
	}

	.case-study section {
		display: grid;
		grid-template-columns: 4rem minmax(12rem, 0.8fr) minmax(0, 1.4fr);
		gap: clamp(1.5rem, 4vw, 5rem);
		padding-block: clamp(2.5rem, 5vw, 4.5rem);
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	.case-study section:last-child {
		border-bottom: 1px solid var(--color-border);
	}

	.section-index {
		color: var(--color-accent);
	}

	.case-study h2 {
		font-size: clamp(2rem, 4vw, 4rem);
		line-height: 0.96;
		letter-spacing: -0.055em;
	}

	.section-content {
		max-width: 46rem;
		font-size: clamp(1rem, 1.45vw, 1.22rem);
		color: var(--color-text-muted);
	}

	.section-content p:last-child,
	.section-content ul:last-child {
		margin-bottom: 0;
	}

	.section-content ul {
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color-border);
	}

	.section-content li {
		position: relative;
		margin: 0;
		padding: 0.85rem 0 0.85rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.section-content li::before {
		content: '↳';
		position: absolute;
		left: 0;
		color: var(--color-accent);
	}

	.next-project {
		position: relative;
		display: block;
		margin-top: clamp(5rem, 10vw, 9rem);
		padding: clamp(3rem, 7vw, 6rem) 0;
		border-top: var(--border-width-structure) solid var(--color-border);
		color: var(--color-text);
		text-decoration: none;
	}

	.next-project strong {
		display: block;
		max-width: 80%;
		margin-top: 1.5rem;
		font-size: clamp(2.8rem, 6vw, 6rem);
		line-height: 0.94;
		letter-spacing: -0.06em;
	}

	.next-project i {
		position: absolute;
		right: 0;
		bottom: 5rem;
		font-size: 2.5rem;
		font-style: normal;
		transition: transform 160ms ease;
	}

	.next-project:hover,
	.next-project:focus-visible {
		color: var(--color-accent);
		background: transparent;
	}

	.next-project:hover i,
	.next-project:focus-visible i {
		transform: translate(0.3rem, -0.3rem);
	}

	@media (max-width: 48rem) {
		.project-actions {
			grid-template-columns: 1fr;
		}

		dl {
			grid-template-columns: 1fr 1fr;
		}

		dl div:last-child {
			grid-column: 1 / -1;
		}

		.case-study section {
			grid-template-columns: 2.5rem 1fr;
		}

		.section-content {
			grid-column: 2;
		}
	}

	@media (max-width: 40rem) {
		.project-hero,
		.visual-wrap,
		.case-study,
		.next-project {
			width: min(100% - 1.25rem, 94rem);
		}

		h1 {
			font-size: clamp(4rem, 20vw, 6.5rem);
		}

		.case-study section {
			grid-template-columns: 1fr;
		}

		.section-content {
			grid-column: auto;
		}

		.project-action {
			min-height: 7.5rem;
		}

		.visual-rail {
			align-items: flex-start;
			padding-block: 0.55rem;
		}

		.visual-caption {
			min-height: var(--target-size-min);
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: 0.1rem;
		}

		.visual-caption span:last-child::before {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.project-action,
		.project-action i {
			transition-duration: 0ms;
		}

		.project-action:hover,
		.project-action:focus-visible {
			transform: none;
		}
	}
</style>
