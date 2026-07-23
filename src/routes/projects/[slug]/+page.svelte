<script lang="ts">
	import ProjectScreenshot from '$lib/components/ProjectScreenshot.svelte';
	import DesignSystemStory from '$lib/components/DesignSystemStory.svelte';
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

	const sections = $derived(parseSections(data.project.body ?? ''));
</script>

<svelte:head>
	<title>{data.project.title} — Pete Nawara</title>
	<meta name="description" content={data.project.summary} />
</svelte:head>

<article>
	<header class="project-hero">
		<a class="back-link" href="/#work">← Selected work</a>
		<p class="category">{data.project.category}</p>
		<h1>{data.project.title}</h1>
		<p class="intro">{data.project.intro}</p>

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

	<div class="visual-wrap">
		<ProjectScreenshot slug={data.project.slug} image={data.project.heroImage} />
	</div>

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

	{#if data.project.liveUrl || data.project.repoUrl}
		<div class="project-links">
			{#if data.project.liveUrl}
				<div>
					<span>Experience</span>
					<a href={data.project.liveUrl} rel="noopener" target="_blank">Visit the live project ↗</a>
				</div>
			{/if}
			{#if data.project.repoUrl}
				<div>
					<span>Source</span>
					<a href={data.project.repoUrl} rel="noopener" target="_blank">View the repository ↗</a>
				</div>
			{/if}
		</div>
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
	.project-links,
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
	.project-links span,
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
		width: min(100%, 110rem);
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

	.project-links {
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	.project-links > div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 2rem;
		padding-block: 1.25rem;
		border-bottom: 1px solid var(--color-border);
	}

	.project-links a {
		color: var(--color-text);
		font-size: 1.15rem;
		text-decoration: none;
	}

	.project-links a:hover,
	.project-links a:focus-visible {
		color: var(--color-accent);
		background: transparent;
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
		.project-links,
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

		.project-links > div {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
