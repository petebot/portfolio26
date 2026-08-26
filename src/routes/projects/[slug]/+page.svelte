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

	function displaySourceHost(url: string): string {
		try {
			const parsed = new URL(url);
			if (parsed.hostname === 'web.archive.org') {
				const archivedHost = parsed.pathname.match(/\/https?:\/\/([^/]+)/)?.[1];
				if (archivedHost) return `${archivedHost.replace(/^www\./, '')} · archive`;
			}

			return parsed.hostname.replace(/^www\./, '');
		} catch {
			return 'Original source';
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
				<span>{data.project.heroLabel ?? 'Product screenshot'}</span>
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
			frame={data.project.heroImage?.frame ?? 'browser'}
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

			{#if data.project.startingPoint?.sectionHeading === section.heading}
				{@const startingPoint = data.project.startingPoint}
				<aside class="starting-point" aria-labelledby={`starting-point-${data.project.slug}`}>
					<header class="starting-point__header">
						<p>{startingPoint.eyebrow}</p>
						<a
							href={startingPoint.url}
							rel="noopener noreferrer"
							target="_blank"
							aria-label={`${startingPoint.linkLabel} (opens in a new tab)`}
						>
							{startingPoint.linkLabel} <span aria-hidden="true">↗</span>
						</a>
					</header>

					<div class="starting-point__intro">
						<span>Before / after</span>
						<h3 id={`starting-point-${data.project.slug}`}>{startingPoint.title}</h3>
						<p>{startingPoint.description}</p>
					</div>

					<figure class="starting-point__visual">
						{#if startingPoint.ownershipLabel && data.project.heroImage}
							<div class="starting-point__split">
								<div class="starting-point__panel starting-point__panel--before">
									<div class="starting-point__ownership">
										<span>Before · existing site</span>
										<strong>{startingPoint.ownershipLabel}</strong>
									</div>
									<ProjectScreenshot
										slug={`${data.project.slug}-original`}
										image={startingPoint.image}
										frame="browser"
										frameLabel={displaySourceHost(startingPoint.url)}
										cursorLabel="Existing site · not my work"
									/>
								</div>

								<div class="starting-point__panel starting-point__panel--after">
									<div class="starting-point__ownership">
										<span>After · independent concept</span>
										<strong>{data.project.heroLabel ?? 'My redesign'}</strong>
									</div>
									<ProjectScreenshot
										slug={`${data.project.slug}-comparison`}
										image={data.project.heroImage}
										frame={data.project.heroImage.frame ?? 'browser'}
										frameLabel={liveSiteHost ?? data.project.title}
										cursorLabel="My redesign concept"
									/>
								</div>
							</div>
						{:else}
							<ProjectScreenshot
								slug={`${data.project.slug}-original`}
								image={startingPoint.image}
								frame="browser"
								frameLabel={displaySourceHost(startingPoint.url)}
								cursorLabel="Original source"
							/>
						{/if}
						<figcaption>{startingPoint.image.caption}</figcaption>
					</figure>

					<div class="starting-point__comparison" aria-label="Original and remake comparison">
						<div>
							<h4>Preserved</h4>
							<ul>
								{#each startingPoint.preserved as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
						<div>
							<h4>Reworked</h4>
							<ul>
								{#each startingPoint.reworked as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
					</div>
				</aside>
			{/if}
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

	{#if data.moreProjects.length > 0}
		<section class="more-projects" aria-labelledby="more-projects-title">
			<header>
				<h2 id="more-projects-title">More selected work</h2>
				<p>Elsewhere in the portfolio</p>
			</header>
			<div class="more-projects__grid" data-count={data.moreProjects.length}>
				{#each data.moreProjects as project}
					<a class="more-project" href={`/projects/${project.slug}`}>
						<span class="more-project__category">{project.category}</span>
						<strong>{project.title}</strong>
						<span class="more-project__footer">
							<span>{project.timeframe?.label ?? project.sortDate}</span>
							<i aria-hidden="true">↗</i>
						</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.project-hero,
	.visual-wrap,
	.case-study,
	.next-project,
	.more-projects {
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

	.starting-point {
		margin-block: clamp(1rem, 3vw, 3rem) clamp(4rem, 8vw, 7rem);
		border: var(--border-width-structure) solid var(--color-border);
		background: var(--color-surface-muted);
	}

	.starting-point__header {
		display: flex;
		min-height: var(--target-size-min);
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-inline: clamp(1rem, 2vw, 1.5rem);
		border-bottom: var(--border-width-structure) solid var(--color-border);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.starting-point__header p {
		margin: 0;
		color: var(--color-accent);
	}

	.starting-point__header a {
		display: inline-flex;
		min-height: var(--target-size-min);
		align-items: center;
		gap: 0.4rem;
		color: var(--color-text);
		text-decoration: none;
	}

	.starting-point__header a:hover,
	.starting-point__header a:focus-visible {
		color: var(--color-accent);
		background: transparent;
	}

	.starting-point__intro {
		display: grid;
		grid-template-columns: 4rem minmax(12rem, 0.8fr) minmax(0, 1.4fr);
		gap: clamp(1.5rem, 4vw, 5rem);
		padding: clamp(2rem, 5vw, 4.5rem) clamp(1rem, 2.5vw, 2.25rem);
	}

	.starting-point__intro > span {
		color: var(--color-accent);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.starting-point__intro h3 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 4rem);
		line-height: 0.96;
		letter-spacing: -0.055em;
	}

	.starting-point__intro p {
		max-width: 46rem;
		margin: 0;
		color: var(--color-text-muted);
		font-size: clamp(1rem, 1.45vw, 1.22rem);
	}

	.starting-point__visual {
		width: calc(100% - clamp(2rem, 5vw, 4.5rem));
		margin: 0 auto;
	}

	.starting-point__split {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(0.75rem, 2vw, 1.5rem);
	}

	.starting-point__panel {
		min-width: 0;
	}

	.starting-point__ownership {
		display: flex;
		min-height: var(--target-size-min);
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem clamp(0.85rem, 2vw, 1.25rem);
		background: var(--color-text);
		color: var(--color-bg);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.starting-point__ownership strong {
		font: inherit;
		font-weight: var(--font-weight-bold);
		letter-spacing: inherit;
		text-align: right;
	}

	.starting-point__panel--after .starting-point__ownership {
		background: var(--color-accent);
		color: var(--color-accent-on);
	}

	.starting-point__visual figcaption {
		max-width: 52rem;
		margin-top: 0.8rem;
		color: var(--color-text-muted);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		line-height: 1.5;
	}

	.starting-point__comparison {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		margin-top: clamp(2rem, 5vw, 4.5rem);
		border-top: var(--border-width-structure) solid var(--color-border);
		background: var(--color-border);
	}

	.starting-point__comparison > div {
		padding: clamp(1.25rem, 2.5vw, 2rem);
		background: var(--color-bg);
	}

	.starting-point__comparison h4 {
		margin: 0 0 1.5rem;
		color: var(--color-accent);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		font-weight: inherit;
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.starting-point__comparison ul {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color-border);
	}

	.starting-point__comparison li {
		position: relative;
		margin: 0;
		padding: 0.85rem 0 0.85rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.starting-point__comparison li::before {
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

	.more-projects {
		padding-bottom: clamp(4rem, 8vw, 7rem);
	}

	.more-projects > header {
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

	.more-projects h2,
	.more-projects > header p {
		margin: 0;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
	}

	.more-projects h2 {
		color: var(--color-accent);
	}

	.more-projects > header p,
	.more-project__category,
	.more-project__footer {
		color: var(--color-text-muted);
	}

	.more-projects__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		border-block: 1px solid var(--color-border);
		background: var(--color-border);
	}

	.more-projects__grid[data-count='1'] {
		grid-template-columns: minmax(0, 32rem);
	}

	.more-projects__grid[data-count='2'] {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.more-projects__grid[data-count='3'] {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.more-projects__grid[data-count='5'] {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}

	.more-projects__grid[data-count='5'] .more-project {
		grid-column: span 2;
	}

	.more-projects__grid[data-count='5'] .more-project:nth-last-child(-n + 2) {
		grid-column: span 3;
	}

	.more-project {
		display: flex;
		min-height: clamp(10rem, 14vw, 13rem);
		flex-direction: column;
		padding: clamp(1rem, 2vw, 1.4rem);
		background: var(--color-bg);
		color: var(--color-text);
		text-decoration: none;
		transition:
			background-color 160ms ease,
			color 160ms ease;
	}

	.more-project__category,
	.more-project__footer {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.more-project strong {
		margin-top: auto;
		font-size: clamp(1.5rem, 2.4vw, 2.5rem);
		line-height: 0.98;
		letter-spacing: -0.045em;
	}

	.more-project__footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.more-project__footer i {
		color: var(--color-text);
		font-size: 1.25rem;
		font-style: normal;
		line-height: 1;
		transition: transform 160ms ease;
	}

	.more-project:hover,
	.more-project:focus-visible {
		background: var(--color-text);
		color: var(--color-bg);
	}

	.more-project:hover .more-project__category,
	.more-project:hover .more-project__footer,
	.more-project:hover .more-project__footer i,
	.more-project:focus-visible .more-project__category,
	.more-project:focus-visible .more-project__footer,
	.more-project:focus-visible .more-project__footer i {
		color: var(--color-bg);
	}

	.more-project:hover .more-project__footer i,
	.more-project:focus-visible .more-project__footer i {
		transform: translate(0.2rem, -0.2rem);
	}

	@media (max-width: 64rem) {
		.more-projects__grid,
		.more-projects__grid[data-count='3'],
		.more-projects__grid[data-count='5'] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.more-projects__grid[data-count='5'] .more-project,
		.more-projects__grid[data-count='5'] .more-project:nth-last-child(-n + 2) {
			grid-column: auto;
		}

		.more-projects__grid[data-count='5'] .more-project:last-child {
			grid-column: 1 / -1;
		}

		.more-projects__grid[data-count='1'] {
			grid-template-columns: minmax(0, 32rem);
		}
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

		.starting-point__intro {
			grid-template-columns: 2.5rem 1fr;
		}

		.starting-point__intro p {
			grid-column: 2;
		}

		.starting-point__split {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 40rem) {
		.project-hero,
		.visual-wrap,
		.case-study,
		.next-project,
		.more-projects {
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

		.starting-point__header {
			align-items: flex-start;
			padding-block: 0.75rem;
		}

		.starting-point__header p {
			max-width: 10rem;
		}

		.starting-point__header a {
			max-width: 11rem;
			justify-content: flex-end;
			text-align: right;
		}

		.starting-point__intro {
			grid-template-columns: 1fr;
		}

		.starting-point__intro p {
			grid-column: auto;
		}

		.starting-point__ownership {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.15rem;
		}

		.starting-point__ownership strong {
			text-align: left;
		}

		.starting-point__comparison {
			grid-template-columns: 1fr;
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

		.more-projects > header {
			align-items: flex-start;
			padding-block: 0.8rem;
		}

		.more-projects > header p {
			max-width: 11rem;
			text-align: right;
		}

		.more-projects__grid,
		.more-projects__grid[data-count] {
			grid-template-columns: 1fr;
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

		.more-project,
		.more-project__footer i {
			transition-duration: 0ms;
		}
	}
</style>
