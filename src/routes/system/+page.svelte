<svelte:head>
	<title>Design System — Pete Nawara</title>
	<meta
		name="description"
		content="The accessible visual and interaction system behind Pete Nawara’s portfolio."
	/>
</svelte:head>

<article class="system-page">
	<header class="system-hero">
		<p class="eyebrow">Portfolio design system · v1.0</p>
		<h1>A quiet system for showing expressive work.</h1>
		<p class="lede">
			The portfolio uses a small set of durable rules: legible type, structural spacing, functional
			color, and enough restraint for each project to keep its own voice.
		</p>
	</header>

	<nav class="system-index" aria-label="Design system sections">
		<a href="#principles">Principles</a>
		<a href="#color">Color</a>
		<a href="#type">Typography</a>
		<a href="#space">Spacing</a>
		<a href="#components">Components</a>
		<a href="#accessibility">Accessibility</a>
	</nav>

	<section id="principles" class="system-section">
		<header class="section-head">
			<span>Foundation</span>
			<h2>Four operating principles</h2>
		</header>
		<ol class="principle-grid">
			<li>
				<b>Useful</b>
				<p>Every visual decision should improve orientation, comprehension, or action.</p>
			</li>
			<li>
				<b>Legible</b>
				<p>Reading comfort and clear hierarchy take priority over stylistic novelty.</p>
			</li>
			<li>
				<b>Adaptable</b>
				<p>Semantic tokens allow the same structure to work across themes and project voices.</p>
			</li>
			<li>
				<b>Honest</b>
				<p>Real work, clear status, and specific ownership are presented without inflation.</p>
			</li>
		</ol>
	</section>

	<section id="color" class="system-section">
		<header class="section-head">
			<span>Color</span>
			<h2>Warm neutrals, one signal.</h2>
			<p>
				The palette follows the system theme automatically. Components use semantic roles rather
				than fixed light or dark values.
			</p>
		</header>
		<div class="swatch-grid" aria-label="Semantic color tokens">
			<div class="swatch bg"><span>Background</span><code>--color-bg</code></div>
			<div class="swatch surface"><span>Surface</span><code>--color-surface</code></div>
			<div class="swatch subtle"><span>Subtle</span><code>--color-bg-subtle</code></div>
			<div class="swatch text"><span>Text</span><code>--color-text</code></div>
			<div class="swatch muted"><span>Muted text</span><code>--color-text-muted</code></div>
			<div class="swatch accent"><span>Signal</span><code>--color-accent</code></div>
		</div>
	</section>

	<section id="type" class="system-section">
		<header class="section-head">
			<span>Typography</span>
			<h2>A compact hierarchy with a readable floor.</h2>
		</header>
		<div class="type-specimens">
			<div>
				<span>Display</span>
				<p class="display">Concept to code.</p>
			</div>
			<div>
				<span>Heading</span>
				<p class="heading">Useful systems with character.</p>
			</div>
			<div>
				<span>Body</span>
				<p class="body-copy">
					A creative technology practice connecting product thinking, visual direction, and
					technical execution.
				</p>
			</div>
			<div>
				<span>Label · 13px minimum</span>
				<p class="label">SELECTED WORK · 2026 · IN PROGRESS</p>
			</div>
		</div>
	</section>

	<section id="space" class="system-section">
		<header class="section-head">
			<span>Spacing</span>
			<h2>An eight-pixel rhythm with four-pixel control.</h2>
		</header>
		<div class="space-scale" aria-label="Spacing scale from 4 to 80 pixels">
			{#each [4, 8, 12, 16, 24, 32, 40, 48, 64, 80] as size, index}
				<div><span>0{index + 1}</span><i style={`width: ${size}px`}></i><b>{size}px</b></div>
			{/each}
		</div>
	</section>

	<section id="components" class="system-section">
		<header class="section-head">
			<span>Components</span>
			<h2>Controls communicate before they decorate.</h2>
		</header>
		<div class="component-grid">
			<div class="specimen">
				<p class="specimen-label">Actions</p>
				<div class="action-row">
					<a class="button" href="#accessibility">Primary action</a>
					<a class="button" data-variant="secondary" href="#accessibility">Secondary</a>
					<a class="button" data-variant="ghost" href="#accessibility">Quiet action</a>
				</div>
			</div>
			<div class="specimen">
				<p class="specimen-label">Project state</p>
				<div class="status-list">
					<span><i class="live"></i>Live</span>
					<span><i class="progress"></i>In progress</span>
					<span><i class="archive"></i>Archive</span>
				</div>
			</div>
		</div>
	</section>

	<section id="accessibility" class="system-section accessibility-section">
		<header class="section-head">
			<span>Accessibility</span>
			<h2>Built into the rules, not added at the end.</h2>
		</header>
		<ul class="access-list">
			<li>
				<strong>AA contrast</strong><span
					>Text, muted text, signal color, and boundaries are validated in both themes.</span
				>
			</li>
			<li>
				<strong>Keyboard first</strong><span
					>A skip link, logical tab order, visible focus, and 44px navigation targets support
					non-pointer use.</span
				>
			</li>
			<li>
				<strong>System preferences</strong><span
					>Light and dark modes follow the operating system; reduced motion removes nonessential
					transitions.</span
				>
			</li>
			<li>
				<strong>Readable scale</strong><span
					>Interface labels never fall below 13px, and long-form copy maintains a controlled
					measure.</span
				>
			</li>
		</ul>
	</section>
</article>

<style>
	.system-page {
		width: min(100% - 2rem, 94rem);
		margin-inline: auto;
	}

	.system-hero {
		padding-block: clamp(4rem, 9vw, 8rem);
	}

	.eyebrow,
	.section-head > span,
	.type-specimens span,
	.specimen-label,
	.space-scale span,
	.space-scale b {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.eyebrow,
	.section-head > span,
	.type-specimens span,
	.specimen-label {
		color: var(--color-text-muted);
	}

	.system-hero h1 {
		max-width: 74rem;
		font-size: var(--font-size-display);
		line-height: 0.94;
		letter-spacing: -0.062em;
	}

	.lede {
		max-width: 48rem;
		margin-top: clamp(2rem, 5vw, 4rem);
		font-size: clamp(1.2rem, 2.2vw, 2rem);
		line-height: 1.25;
		color: var(--color-text-muted);
	}

	.system-index {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding-block: 1rem;
		border-block: var(--border-width-structure) solid var(--color-border);
	}

	.system-index a {
		display: inline-flex;
		align-items: center;
		min-height: var(--target-size-min);
		padding-inline: 0.9rem;
		color: var(--color-text);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		text-decoration: none;
		text-transform: uppercase;
	}

	.system-index a:hover,
	.system-index a:focus-visible {
		color: var(--color-accent);
		background: var(--color-bg-subtle);
	}

	.system-section {
		padding-block: clamp(5rem, 10vw, 9rem);
		border-bottom: var(--border-width-structure) solid var(--color-border);
	}

	.section-head {
		display: grid;
		grid-template-columns: minmax(10rem, 0.65fr) 2fr;
		gap: 1rem 3rem;
		margin-bottom: clamp(2.5rem, 6vw, 5rem);
	}

	.section-head h2 {
		max-width: 58rem;
		font-size: clamp(2.5rem, 5vw, 5rem);
		line-height: 0.98;
		letter-spacing: -0.055em;
	}

	.section-head > p {
		grid-column: 2;
		max-width: var(--measure-reading);
		color: var(--color-text-muted);
	}

	.principle-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color-border-strong);
	}

	.principle-grid li {
		min-height: 17rem;
		margin: 0;
		padding: 1.25rem;
		border-right: 1px solid var(--color-border);
	}

	.principle-grid li:last-child {
		border-right: 0;
	}
	.principle-grid b {
		font-size: 1.5rem;
	}
	.principle-grid p {
		margin-top: 5rem;
		color: var(--color-text-muted);
	}

	.swatch-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: var(--color-border);
		border: 1px solid var(--color-border);
	}

	.swatch {
		min-height: 13rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 1rem;
	}

	.swatch span {
		font-weight: 650;
	}
	.swatch code {
		align-self: flex-start;
	}
	.swatch.bg {
		background: var(--color-bg);
	}
	.swatch.surface {
		background: var(--color-surface);
	}
	.swatch.subtle {
		background: var(--color-bg-subtle);
	}
	.swatch.text {
		background: var(--color-text);
		color: var(--color-bg);
	}
	.swatch.muted {
		background: var(--color-text-muted);
		color: var(--color-bg);
	}
	.swatch.accent {
		background: var(--color-accent);
		color: var(--color-accent-on);
	}

	.type-specimens {
		border-top: 1px solid var(--color-border-strong);
	}
	.type-specimens > div {
		display: grid;
		grid-template-columns: minmax(10rem, 0.65fr) 2fr;
		gap: 2rem;
		padding-block: 1.75rem;
		border-bottom: 1px solid var(--color-border);
	}
	.type-specimens p {
		margin: 0;
	}
	.display {
		font-size: clamp(3rem, 7vw, 7rem);
		line-height: 0.92;
		letter-spacing: -0.065em;
	}
	.heading {
		font-size: clamp(2rem, 4vw, 4rem);
		line-height: 1;
		letter-spacing: -0.05em;
	}
	.body-copy {
		max-width: 48rem;
		font-size: 1.2rem;
		color: var(--color-text-muted);
	}
	.label {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
	}

	.space-scale {
		max-width: 56rem;
	}
	.space-scale > div {
		display: grid;
		grid-template-columns: 3rem minmax(5rem, 1fr) 4rem;
		align-items: center;
		gap: 1rem;
		min-height: 2.75rem;
		border-bottom: 1px solid var(--color-border);
	}
	.space-scale i {
		height: 0.65rem;
		background: var(--color-accent);
	}
	.space-scale b {
		font-weight: 400;
		color: var(--color-text-muted);
	}

	.component-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.specimen {
		min-height: 18rem;
		padding: 1.5rem;
		background: var(--color-bg-subtle);
	}
	.action-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 4rem;
	}
	.status-list {
		display: grid;
		gap: 0;
		margin-top: 3rem;
		border-top: 1px solid var(--color-border);
	}
	.status-list span {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-height: var(--target-size-min);
		border-bottom: 1px solid var(--color-border);
	}
	.status-list i {
		width: 0.65rem;
		aspect-ratio: 1;
		border-radius: 50%;
	}
	.status-list .live {
		background: var(--color-success);
	}
	.status-list .progress {
		background: var(--color-warning);
	}
	.status-list .archive {
		background: var(--color-text-muted);
	}

	.access-list {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color-border-strong);
	}
	.access-list li {
		display: grid;
		grid-template-columns: minmax(10rem, 0.65fr) 2fr;
		gap: 3rem;
		margin: 0;
		padding-block: 1.4rem;
		border-bottom: 1px solid var(--color-border);
	}
	.access-list span {
		max-width: var(--measure-reading);
		color: var(--color-text-muted);
	}

	@media (max-width: 52rem) {
		.section-head,
		.type-specimens > div,
		.access-list li {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
		.section-head > p {
			grid-column: auto;
		}
		.principle-grid {
			grid-template-columns: 1fr 1fr;
		}
		.principle-grid li:nth-child(2) {
			border-right: 0;
		}
		.swatch-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 40rem) {
		.system-page {
			width: min(100% - 1.25rem, 94rem);
		}
		.system-index {
			flex-wrap: nowrap;
			overflow-x: auto;
		}
		.system-index a {
			flex: 0 0 auto;
		}
		.principle-grid,
		.swatch-grid,
		.component-grid {
			grid-template-columns: 1fr;
		}
		.principle-grid li {
			min-height: auto;
			border-right: 0;
			border-bottom: 1px solid var(--color-border);
		}
		.principle-grid p {
			margin-top: 2.5rem;
		}
		.swatch {
			min-height: 10rem;
		}
	}
</style>
