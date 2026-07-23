<script lang="ts">
	import ProjectScreenshot from '$lib/components/ProjectScreenshot.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Pete Nawara — Creative Technologist</title>
	<meta
		name="description"
		content="Pete Nawara is a creative technologist who designs and builds digital products, interfaces, and systems."
	/>
</svelte:head>

<section class="hero" aria-labelledby="hero-title">
	<div class="section-tag"><i></i><span>Creative technology practice</span></div>
	<h1 id="hero-title">I design and build digital products, interfaces, and systems.</h1>
	<p class="hero-intro">
		A creative technology practice connecting product thinking, visual direction, and technical
		execution—from first idea to working form.
	</p>
	<div class="hero-meta">
		<p><i></i> Creative Technologist</p>
		<a href="mailto:pete@petenawara.com">Email Pete <span aria-hidden="true">↗</span></a>
	</div>
</section>

<section class="work" id="work" aria-labelledby="work-title">
	<header class="section-heading">
		<div class="section-tag"><i></i><span>Selected work</span></div>
		<div>
			<h2 id="work-title">Useful systems with a distinct character.</h2>
			<p>Selected work across creative practice, culture, service, and place.</p>
		</div>
	</header>

	<ol class="project-list">
		{#each data.projects as project, index}
			<li>
				<a
					class="project-card"
					href={`/projects/${project.slug}`}
					aria-label={`View ${project.title}`}
				>
					<div class="project-copy">
						<span class="project-number">0{index + 1}</span>
						<div>
							<p class="project-category">{project.category}</p>
							<h3>{project.title}</h3>
							<p class="project-summary">{project.summary}</p>
						</div>
						<span class="project-arrow" aria-hidden="true">↗</span>
					</div>
					<ProjectScreenshot slug={project.slug} image={project.heroImage} compact />
					<div class="project-meta">
						<span>{project.timeframe?.label ?? project.sortDate}</span>
						<span>{project.role}</span>
						<span>{project.tech?.slice(0, 3).join(' · ')}</span>
					</div>
				</a>
			</li>
		{/each}
	</ol>
</section>

<section class="practice" id="practice" aria-labelledby="practice-title">
	<header class="section-heading">
		<div class="section-tag"><i></i><span>Working method</span></div>
		<div>
			<h2 id="practice-title">Four parts, one practice.</h2>
			<p>I work across the visible experience and the operating logic behind it.</p>
		</div>
	</header>

	<ol class="practice-grid">
		<li>
			<span>01</span>
			<h3>Product logic</h3>
			<p>
				Clarifying the problem, shaping the flow, and deciding what belongs before pixels arrive.
			</p>
		</li>
		<li>
			<span>02</span>
			<h3>Visual direction</h3>
			<p>Building an interface language with a distinct voice, useful hierarchy, and restraint.</p>
		</li>
		<li>
			<span>03</span>
			<h3>Technical execution</h3>
			<p>Turning the direction into responsive, accessible software that holds up in use.</p>
		</li>
		<li>
			<span>04</span>
			<h3>Durable systems</h3>
			<p>
				Designing content, data, and component structures that can evolve without losing coherence.
			</p>
		</li>
	</ol>
</section>

<section class="about" id="about" aria-labelledby="about-title">
	<div class="section-tag"><i></i><span>Profile</span></div>
	<div>
		<h2 id="about-title">One continuous line from concept to code.</h2>
		<div class="about-copy">
			<p>
				I’m Pete Nawara, a creative technologist interested in useful systems with strong visual
				character. I move between product strategy, interaction design, frontend engineering, and
				the infrastructure that keeps a product working.
			</p>
			<p>
				My recent work includes tools for creative practice, participatory experiences, and small
				businesses—often taking an idea from a blank page through a functional release.
			</p>
		</div>
	</div>
</section>

<section class="contact" aria-labelledby="contact-title">
	<div class="section-tag"><i></i><span>Contact</span></div>
	<h2 id="contact-title">Have something interesting to make?</h2>
	<a href="mailto:pete@petenawara.com">Email Pete <span aria-hidden="true">↗</span></a>
</section>

<style>
	.hero,
	.work,
	.about,
	.contact {
		width: min(100% - 2rem, 94rem);
		margin-inline: auto;
	}

	.hero {
		min-height: calc(100svh - 5rem);
		display: grid;
		grid-template-rows: auto 1fr auto auto;
		padding-block: clamp(3rem, 6vw, 5rem) 1.5rem;
	}

	.section-tag {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.section-tag i {
		width: 0.7rem;
		height: 0.18rem;
		background: var(--color-accent);
	}

	.hero h1 {
		align-self: center;
		max-width: 76rem;
		font-size: var(--font-size-display);
		line-height: 0.94;
		letter-spacing: -0.062em;
	}

	.hero-intro {
		max-width: 35rem;
		margin-bottom: clamp(2rem, 4vw, 3.5rem);
		font-size: clamp(1rem, 1.45vw, 1.3rem);
		color: var(--color-text-muted);
	}

	.hero-meta {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		border-top: var(--border-width-structure) solid var(--color-border);
		padding-top: 1rem;
	}

	.hero-meta p {
		margin: 0;
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		text-transform: uppercase;
	}

	.hero-meta i {
		display: inline-block;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		margin-right: 0.6rem;
		background: var(--color-accent);
	}

	.hero-meta a,
	.contact a {
		color: var(--color-text);
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.02em;
		text-decoration: none;
	}

	.hero-meta a:hover,
	.hero-meta a:focus-visible,
	.contact a:hover,
	.contact a:focus-visible {
		color: var(--color-accent);
		background: transparent;
	}

	.work {
		padding-block: clamp(6rem, 12vw, 11rem);
	}

	.section-heading {
		display: grid;
		grid-template-columns: minmax(11rem, 0.7fr) 2fr;
		gap: 2rem;
		margin-bottom: clamp(3rem, 7vw, 6rem);
	}

	.section-heading h2,
	.about h2,
	.contact h2 {
		font-size: clamp(2.5rem, 4.8vw, 5rem);
		line-height: 0.98;
		letter-spacing: -0.055em;
	}

	.section-heading > div:last-child > p {
		max-width: 34rem;
		color: var(--color-text-muted);
		font-size: 1.05rem;
	}

	.project-list,
	.practice-grid {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.project-list > li {
		margin: 0;
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	.project-list > li:last-child {
		border-bottom: var(--border-width-structure) solid var(--color-border);
	}

	.project-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.95fr);
		gap: clamp(2rem, 6vw, 7rem);
		padding-block: clamp(2rem, 5vw, 4.5rem);
		color: var(--color-text);
		text-decoration: none;
	}

	.project-card:hover,
	.project-card:focus-visible {
		color: var(--color-text);
		background: transparent;
	}

	.project-copy {
		display: grid;
		grid-template-columns: 2.5rem minmax(0, 1fr) auto;
		align-items: start;
		gap: 1.25rem;
	}

	.project-number,
	.project-category,
	.project-meta {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.project-number {
		color: var(--color-text-muted);
	}

	.project-category {
		margin-bottom: 1rem;
		color: var(--color-text-muted);
	}

	.project-copy h3 {
		font-size: clamp(2.2rem, 4.1vw, 4.4rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
		transition: color 160ms ease;
	}

	.project-summary {
		max-width: 34rem;
		margin-top: 1.75rem;
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		color: var(--color-text-muted);
	}

	.project-arrow {
		font-size: 1.4rem;
		transition: transform 160ms ease;
	}

	.project-card:hover .project-copy h3,
	.project-card:focus-visible .project-copy h3 {
		color: var(--color-accent);
	}

	.project-card:hover .project-arrow,
	.project-card:focus-visible .project-arrow {
		transform: translate(0.2rem, -0.2rem);
	}

	.project-meta {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr 2fr;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}

	.practice {
		padding: clamp(5rem, 10vw, 9rem) max(1rem, calc((100vw - 94rem) / 2));
		background: var(--color-bg-subtle);
		color: var(--color-text);
	}

	.practice h3 {
		color: var(--color-text);
	}

	.practice-grid p {
		color: var(--color-text-muted);
	}

	.practice-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-top: var(--border-width-structure) solid var(--color-border-strong);
	}

	.practice-grid li {
		min-height: 18rem;
		margin: 0;
		padding: 1rem 1.25rem 1.25rem;
		border-right: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
	}

	.practice-grid li:last-child {
		border-right: 0;
	}

	.practice-grid span {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		color: var(--color-accent);
	}

	.practice-grid h3 {
		margin-top: auto;
		font-size: clamp(1.5rem, 2vw, 2.15rem);
		letter-spacing: -0.045em;
	}

	.practice-grid p {
		margin: 0;
		font-size: var(--font-size-body-small);
	}

	.about {
		display: grid;
		grid-template-columns: minmax(11rem, 0.7fr) 2fr;
		gap: 2rem;
		padding-block: clamp(6rem, 13vw, 12rem);
	}

	.about-copy {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2rem, 5vw, 5rem);
		margin-top: clamp(2rem, 5vw, 4rem);
		color: var(--color-text-muted);
		font-size: clamp(1rem, 1.35vw, 1.2rem);
	}

	.contact {
		padding-block: 5rem;
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	.contact h2 {
		max-width: 64rem;
		max-width: 54rem;
		margin: 3rem 0 2.5rem;
	}

	.contact a {
		display: inline-flex;
		gap: 1rem;
	}

	@media (max-width: 52rem) {
		.hero {
			min-height: 47rem;
		}

		.section-heading,
		.about {
			grid-template-columns: 1fr;
		}

		.project-card {
			grid-template-columns: 1fr;
		}

		.project-meta {
			grid-template-columns: 1fr 1fr;
		}

		.project-meta span:last-child {
			grid-column: 1 / -1;
		}

		.practice-grid {
			grid-template-columns: 1fr 1fr;
		}

		.practice-grid li:nth-child(2) {
			border-right: 0;
		}

		.practice-grid li {
			min-height: 15rem;
			border-bottom: 1px solid var(--color-border);
		}
	}

	@media (max-width: 40rem) {
		.hero,
		.work,
		.about,
		.contact {
			width: min(100% - 1.25rem, 94rem);
		}

		.hero h1 {
			font-size: clamp(3.2rem, 17vw, 5.5rem);
		}

		.hero-meta {
			align-items: flex-start;
		}

		.project-copy {
			grid-template-columns: 2rem minmax(0, 1fr) auto;
			gap: 0.75rem;
		}

		.practice {
			padding-inline: 0.625rem;
		}

		.practice-grid {
			grid-template-columns: 1fr;
		}

		.practice-grid li {
			min-height: 12rem;
			border-right: 0;
		}

		.about-copy {
			grid-template-columns: 1fr;
		}
	}
</style>
