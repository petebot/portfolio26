<script lang="ts">
	import HomeMotion from '$lib/components/HomeMotion.svelte';
	import ProjectScreenshot from '$lib/components/ProjectScreenshot.svelte';
	import ScrollReel from '$lib/components/ScrollReel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const projectCards = [
		{ tone: '#eecc55', rotation: -0.32 },
		{ tone: '#eab0c7', rotation: 0.28 },
		{ tone: '#aebde8', rotation: -0.22 },
		{ tone: '#e8a57f', rotation: 0.26 }
	];
</script>

<svelte:head>
	<title>Pete Nawara — Creative Technologist</title>
	<meta
		name="description"
		content="Pete Nawara is a creative technologist who designs and builds digital products, interfaces, and systems."
	/>
</svelte:head>

<div data-home-motion>
	<HomeMotion />

	<section class="hero" aria-labelledby="hero-title">
		<div class="section-tag"><i></i><span>Creative technology practice</span></div>
		<h1 id="hero-title" aria-label="I design and build digital products, interfaces, and systems.">
			<span class="hero-line" data-hero-line><span>I design + build</span></span>
			<span class="hero-line hero-line--offset" data-hero-line><span>digital products,</span></span>
			<span class="hero-line" data-hero-line><span>interfaces + systems.</span></span>
		</h1>
		<p class="hero-intro">
			<span>
				A creative technology practice connecting product thinking, visual direction, and technical
				execution—from first idea to working form.
			</span>
		</p>
		<div class="hero-meta">
			<p><i></i> Creative Technologist <span class="hero-marker" aria-hidden="true"></span></p>
			<a href="mailto:pete@petenawara.com">Email Pete <span aria-hidden="true">↗</span></a>
		</div>
	</section>

	<section class="work" id="work" aria-labelledby="work-title">
		<header class="section-heading">
			<div class="section-tag"><i></i><span>Selected work</span></div>
			<div>
				<h2 id="work-title" data-reveal data-rest-rotation="-0.35">
					Useful systems with a distinct character.
				</h2>
				<p>Selected work across creative practice, culture, service, and place.</p>
			</div>
		</header>

		<ol class="project-list">
			{#each data.projects as project, index}
				{@const card = projectCards[index % projectCards.length]}
				<li style={`--card-index: ${index}; --card-tone: ${card.tone};`}>
					<a
						class="project-card"
						href={`/projects/${project.slug}`}
						aria-label={`View ${project.title}`}
						data-project-card
						data-rest-rotation={card.rotation}
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

	<ScrollReel />

	<section class="color-bridge" aria-labelledby="bridge-title">
		<div class="color-bridge__blinds" aria-hidden="true">
			{#each Array(7) as _}
				<i class="color-bridge__blind"></i>
			{/each}
		</div>
		<div class="color-bridge__content">
			<div class="section-tag section-tag--dark"><i></i><span>The through-line</span></div>
			<h2 id="bridge-title"><span>Concept</span><span>→ working form</span></h2>
			<p>The idea, the interface, and the machinery behind it—held as one continuous thing.</p>
		</div>
	</section>

	<section class="practice" id="practice" aria-labelledby="practice-title">
		<header class="section-heading">
			<div class="section-tag"><i></i><span>Working method</span></div>
			<div>
				<h2 id="practice-title" data-reveal data-rest-rotation="0.28">Four parts, one practice.</h2>
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
				<p>
					Building an interface language with a distinct voice, useful hierarchy, and restraint.
				</p>
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
					Designing content, data, and component structures that can evolve without losing
					coherence.
				</p>
			</li>
		</ol>
	</section>

	<section class="about" id="about" aria-labelledby="about-title">
		<div class="section-tag"><i></i><span>Profile</span></div>
		<div>
			<h2 id="about-title" data-reveal data-rest-rotation="-0.3">
				One continuous line from concept to code.
			</h2>
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
		<div class="contact__inner">
			<div class="section-tag section-tag--light"><i></i><span>Contact</span></div>
			<h2 id="contact-title" data-reveal data-rest-rotation="0.36">
				Have something interesting to make?
			</h2>
			<a href="mailto:pete@petenawara.com">Email Pete <span aria-hidden="true">↗</span></a>
		</div>
	</section>
</div>

<style>
	.hero,
	.work,
	.about,
	.contact__inner {
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
		width: 100%;
		font-size: clamp(4rem, 8.15vw, 8rem);
		line-height: 0.82;
		letter-spacing: -0.07em;
	}

	.hero-line {
		display: block;
		overflow: hidden;
		padding: 0.08em 0.03em 0.13em;
	}

	.hero-line > span {
		display: block;
		transform-origin: 25% 80%;
	}

	.hero-line--offset {
		padding-left: clamp(0rem, 11vw, 10rem);
	}

	.hero-intro {
		max-width: 35rem;
		margin-bottom: clamp(2rem, 4vw, 3.5rem);
		margin-left: clamp(0rem, 43vw, 41rem);
		font-size: clamp(1rem, 1.45vw, 1.3rem);
		color: var(--color-text-muted);
	}

	.hero-intro > span {
		display: block;
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

	.hero-marker {
		display: inline-block;
		width: clamp(3rem, 8vw, 7rem);
		height: 1px;
		margin-left: 0.7rem;
		vertical-align: middle;
		background: currentColor;
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
		position: sticky;
		top: calc(5.35rem + var(--card-index) * 0.45rem);
		margin: 0 0 clamp(3.5rem, 9vh, 6.5rem);
		overflow: hidden;
		background: var(--card-tone);
		border: var(--border-width-structure) solid var(--color-punch-ink);
		border-radius: 0.7rem;
		box-shadow: 0 1rem 2.4rem rgb(24 24 23 / 12%);
	}

	.project-list > li:last-child {
		margin-bottom: 0;
	}

	.project-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.95fr);
		gap: clamp(2rem, 6vw, 7rem);
		padding: clamp(1.4rem, 4vw, 3.2rem);
		color: var(--color-punch-ink);
		text-decoration: none;
		transform-origin: center 16%;
	}

	.project-card:hover,
	.project-card:focus-visible {
		color: var(--color-punch-ink);
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
		color: rgb(24 24 23 / 64%);
	}

	.project-category {
		margin-bottom: 1rem;
		color: rgb(24 24 23 / 64%);
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
		color: rgb(24 24 23 / 72%);
	}

	.project-arrow {
		font-size: 1.4rem;
		transition: transform 160ms ease;
	}

	.project-card:hover .project-copy h3,
	.project-card:focus-visible .project-copy h3 {
		color: var(--color-punch-ink);
		text-decoration: underline;
		text-decoration-thickness: 0.06em;
		text-underline-offset: 0.11em;
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
		border-top: 1px solid rgb(24 24 23 / 36%);
		color: rgb(24 24 23 / 68%);
	}

	.color-bridge {
		position: relative;
		min-height: min(78rem, 92svh);
		display: grid;
		place-items: center;
		isolation: isolate;
		overflow: hidden;
		background: var(--color-bg);
		color: var(--color-punch-ink);
	}

	.color-bridge__blinds {
		position: absolute;
		inset: 0;
		z-index: -1;
		display: grid;
		grid-template-rows: repeat(7, 1fr);
	}

	.color-bridge__blind {
		display: block;
		background: var(--color-punch-orange);
		transform-origin: left center;
	}

	.color-bridge__blind:nth-child(even) {
		transform-origin: right center;
	}

	.color-bridge__content {
		width: min(100% - 2rem, 94rem);
	}

	.color-bridge h2 {
		display: flex;
		flex-direction: column;
		margin: clamp(4rem, 10vh, 8rem) 0 2rem;
		font-size: clamp(4.2rem, 12vw, 12rem);
		line-height: 0.75;
		letter-spacing: -0.075em;
		color: var(--color-punch-ink);
	}

	.color-bridge h2 span:last-child {
		align-self: flex-end;
	}

	.color-bridge__content > p {
		max-width: 38rem;
		margin: 0 0 0 auto;
		font-size: clamp(1.1rem, 1.7vw, 1.5rem);
		line-height: 1.35;
	}

	.section-tag--dark {
		color: rgb(24 24 23 / 68%);
	}

	.section-tag--dark i {
		background: var(--color-punch-ink);
	}

	.practice {
		padding: clamp(5rem, 10vw, 9rem) max(1rem, calc((100vw - 94rem) / 2));
		background: var(--color-punch-ink);
		color: var(--color-punch-paper);
	}

	.practice h2,
	.practice h3 {
		color: var(--color-punch-paper);
	}

	.practice .section-tag,
	.practice .section-heading > div:last-child > p,
	.practice-grid p {
		color: rgb(244 240 230 / 67%);
	}

	.practice .section-tag i {
		background: var(--color-punch-orange);
	}

	.practice-grid span {
		color: var(--color-punch-orange);
	}

	.practice-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-top: var(--border-width-structure) solid rgb(244 240 230 / 58%);
	}

	.practice-grid li {
		min-height: 18rem;
		margin: 0;
		padding: 1rem 1.25rem 1.25rem;
		border-right: 1px solid rgb(244 240 230 / 24%);
		display: flex;
		flex-direction: column;
	}

	.practice-grid li:last-child {
		border-right: 0;
	}

	.practice-grid span {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
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
		background: var(--color-punch-blue);
		color: var(--color-punch-paper);
	}

	.contact__inner {
		padding-block: clamp(5rem, 10vw, 9rem);
	}

	.contact h2 {
		max-width: 54rem;
		margin: 3rem 0 2.5rem;
		color: var(--color-punch-paper);
	}

	.contact a {
		display: inline-flex;
		gap: 1rem;
		color: var(--color-punch-paper);
	}

	.contact a:hover,
	.contact a:focus-visible {
		color: var(--color-punch-paper);
		text-decoration: underline;
	}

	.section-tag--light {
		color: rgb(244 240 230 / 72%);
	}

	.section-tag--light i {
		background: var(--color-punch-paper);
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
			border-bottom: 1px solid rgb(244 240 230 / 24%);
		}
	}

	@media (max-width: 40rem) {
		.hero,
		.work,
		.about,
		.contact__inner,
		.color-bridge__content {
			width: min(100% - 1.25rem, 94rem);
		}

		.hero h1 {
			font-size: clamp(3.2rem, 17vw, 5.5rem);
		}

		.hero-line--offset {
			padding-left: 0;
		}

		.hero-intro {
			margin-left: 0;
		}

		.hero-meta {
			align-items: flex-start;
		}

		.project-copy {
			grid-template-columns: 2rem minmax(0, 1fr) auto;
			gap: 0.75rem;
		}

		.project-list > li {
			position: relative;
			top: auto;
			margin-bottom: 1.25rem;
		}

		.project-card {
			padding: 1rem;
		}

		.color-bridge {
			min-height: 42rem;
		}

		.color-bridge h2 {
			font-size: clamp(3.5rem, 18vw, 6rem);
			line-height: 0.82;
		}

		.color-bridge h2 span:last-child {
			align-self: flex-start;
		}

		.color-bridge__content > p {
			margin-left: 0;
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
