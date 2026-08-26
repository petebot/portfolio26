<script lang="ts">
	import type { DesignSystemSummary } from '$lib/server/projects';

	let { system }: { system: DesignSystemSummary } = $props();

	const statusLabel = $derived(system.status.charAt(0).toUpperCase() + system.status.slice(1));
</script>

<section class="design-system" aria-labelledby="design-system-title">
	<header class="story-header">
		<div class="system-label">
			<span>Design system</span>
			<span>{statusLabel} · Contract {system.contractVersion}</span>
		</div>
		<div class="system-intro">
			<p class="eyebrow">The system behind the work</p>
			<h2 id="design-system-title">{system.name}</h2>
			<p class="summary">{system.summary}</p>
			{#if system.specimenUrl}
				<a href={system.specimenUrl} rel="noopener" target="_blank">Explore the system specimen ↗</a
				>
			{/if}
		</div>
	</header>

	<ol class="principles" aria-label={`${system.name} principles`}>
		{#each system.principles as principle, index}
			<li>
				<span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
				<h3>{principle.name}</h3>
				<p>{principle.description}</p>
			</li>
		{/each}
	</ol>

	{#if system.showcase}
		<div class="fingerprint">
			<div class="fingerprint-heading">
				<p class="eyebrow">Visual fingerprint</p>
				<h3>Identity, components, and proof.</h3>
				<p>
					A curated view of the system’s real foundations and state coverage—not a second
					documentation site.
				</p>
			</div>

			<section class="evidence-section palette-section" aria-labelledby="palette-title">
				<div class="evidence-heading">
					<span>01</span>
					<div>
						<p>Foundation</p>
						<h4 id="palette-title">Semantic color</h4>
					</div>
				</div>
				<ul class="palette" aria-label={`${system.name} semantic colors`}>
					{#each system.showcase.palette as color}
						<li>
							<i style:background-color={color.value} aria-hidden="true"></i>
							<div><strong>{color.name}</strong><code>{color.value}</code></div>
							<p>{color.role}</p>
						</li>
					{/each}
				</ul>
			</section>

			<section class="evidence-section type-section" aria-labelledby="type-title">
				<div class="evidence-heading">
					<span>02</span>
					<div>
						<p>Foundation</p>
						<h4 id="type-title">Typography roles</h4>
					</div>
				</div>
				<ul class="type-roles">
					{#each system.showcase.typography as type}
						<li>
							<span>{type.role}</span>
							<strong>{type.family}</strong>
							<p>{type.description}</p>
						</li>
					{/each}
				</ul>
			</section>

			<section class="evidence-section component-section" aria-labelledby="components-title">
				<div class="evidence-heading">
					<span>03</span>
					<div>
						<p>Inventory</p>
						<h4 id="components-title">Representative components</h4>
					</div>
				</div>
				<div class="component-story">
					{#if system.showcase.componentSnapshot}
						<figure
							class="component-snapshot"
							class:component-snapshot--fritz={system.showcase.componentSnapshot.url.includes(
								'fritz-components-clay'
							)}
						>
							<picture>
								{#if system.showcase.componentSnapshot.darkUrl}
									<source
										srcset={`${system.showcase.componentSnapshot.darkUrl}?v=20260826-fritz-clay-four-up`}
										media="(prefers-color-scheme: dark)"
									/>
								{/if}
								{#if system.showcase.componentSnapshot.lightUrl}
									<source
										srcset={`${system.showcase.componentSnapshot.lightUrl}?v=20260826-fritz-clay-four-up`}
										media="(prefers-color-scheme: light)"
									/>
								{/if}
								<img
									src={`${system.showcase.componentSnapshot.url}?v=20260826-fritz-clay-four-up`}
									alt={system.showcase.componentSnapshot.alt ?? ''}
									width={system.showcase.componentSnapshot.width}
									height={system.showcase.componentSnapshot.height}
									loading="lazy"
								/>
							</picture>
							{#if system.showcase.componentSnapshot.caption}
								<figcaption>{system.showcase.componentSnapshot.caption}</figcaption>
							{/if}
						</figure>
					{/if}
					<ul class="component-evidence">
						{#each system.showcase.components as component}
							<li>
								<h5>{component.name}</h5>
								<p>{component.description}</p>
								<ul aria-label={`${component.name} demonstrated states`}>
									{#each component.states as state}
										<li>{state}</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</div>
			</section>

			<section class="evidence-section proof-section" aria-labelledby="proof-title">
				<div class="evidence-heading">
					<span>04</span>
					<div>
						<p>In the product</p>
						<h4 id="proof-title">System at work</h4>
					</div>
				</div>
				<div class="proof-grid">
					{#if system.showcase.productProof.image}
						<div
							class="proof-image"
							class:proof-image--full-bleed={system.showcase.productProof.image.url.includes(
								'-clay.'
							)}
							class:proof-image--fritz={system.showcase.productProof.image.url.includes(
								'fritz-system-at-work-clay'
							)}
						>
							<picture>
								{#if system.showcase.productProof.image.darkUrl}
									<source
										srcset={`${system.showcase.productProof.image.darkUrl}?v=20260826-fritz-clay-system`}
										media="(prefers-color-scheme: dark)"
									/>
								{/if}
								{#if system.showcase.productProof.image.lightUrl}
									<source
										srcset={`${system.showcase.productProof.image.lightUrl}?v=20260826-fritz-clay-system`}
										media="(prefers-color-scheme: light)"
									/>
								{/if}
								<img
									src={`${system.showcase.productProof.image.url}?v=20260826-fritz-clay-system`}
									alt={system.showcase.productProof.image.alt ??
										`${system.name} shown in the product`}
									loading="lazy"
								/>
							</picture>
						</div>
					{/if}
					<div class="proof-copy">
						<p class="proof-label">Decision propagation</p>
						<h5>{system.showcase.productProof.title}</h5>
						<p>{system.showcase.productProof.description}</p>
						<div class="accessibility-proof">
							<span>Accessibility and resilience</span>
							<strong>{system.showcase.accessibility.title}</strong>
							<p>{system.showcase.accessibility.description}</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	{/if}
</section>

<style>
	.design-system {
		width: min(100% - 2rem, 94rem);
		margin-inline: auto;
		padding-block: clamp(1rem, 3vw, 3rem) clamp(5rem, 11vw, 10rem);
	}

	.story-header {
		display: grid;
		grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1.4fr);
		gap: clamp(2rem, 7vw, 8rem);
		padding: clamp(2rem, 5vw, 4.5rem) 0;
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	.system-label {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.system-label span:first-child,
	.eyebrow,
	.principles li > span {
		color: var(--color-accent);
	}

	.system-label span:last-child {
		color: var(--color-text-muted);
		text-align: right;
	}

	.eyebrow {
		margin: 0 0 1.25rem;
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	h2 {
		max-width: 52rem;
		font-size: clamp(2.8rem, 6vw, 6.5rem);
		line-height: 0.92;
		letter-spacing: -0.065em;
	}

	.summary {
		max-width: 46rem;
		margin: clamp(1.5rem, 3vw, 2.5rem) 0;
		color: var(--color-text-muted);
		font-size: clamp(1.15rem, 1.8vw, 1.5rem);
		line-height: 1.42;
	}

	.system-intro a {
		display: inline-flex;
		min-height: var(--target-size-min);
		align-items: center;
		color: var(--color-text);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.principles {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0;
		margin: 0;
		padding: 0;
		border-block: 1px solid var(--color-border);
		list-style: none;
	}

	.principles li {
		display: grid;
		grid-template-columns: 2.5rem minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: 1rem;
		margin: 0;
		padding: clamp(1.5rem, 3vw, 2.5rem) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.principles li:nth-child(odd) {
		padding-right: clamp(1rem, 3vw, 3rem);
		border-right: 1px solid var(--color-border);
	}

	.principles li:nth-child(even) {
		padding-left: clamp(1rem, 3vw, 3rem);
	}

	.principles li:last-child,
	.principles li:nth-last-child(2):nth-child(odd) {
		border-bottom: 0;
	}

	.principles li > span {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
	}

	h3 {
		font-size: clamp(1.25rem, 2vw, 1.8rem);
		line-height: 1.05;
		letter-spacing: -0.035em;
	}

	.principles p {
		margin: 0;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.fingerprint {
		padding-top: clamp(5rem, 10vw, 9rem);
	}

	.fingerprint-heading {
		display: grid;
		grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1.4fr);
		gap: 1rem clamp(2rem, 7vw, 8rem);
		padding-bottom: clamp(2.5rem, 5vw, 4.5rem);
	}

	.fingerprint-heading .eyebrow {
		grid-row: 1 / span 2;
	}

	.fingerprint-heading h3 {
		font-size: clamp(2.25rem, 4vw, 4.5rem);
		line-height: 0.96;
		letter-spacing: -0.055em;
	}

	.fingerprint-heading > p:last-child {
		max-width: 42rem;
		margin: 0;
		color: var(--color-text-muted);
		font-size: clamp(1rem, 1.5vw, 1.25rem);
	}

	.evidence-section {
		display: grid;
		grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1.4fr);
		gap: clamp(2rem, 7vw, 8rem);
		padding-block: clamp(2.5rem, 5vw, 4.5rem);
		border-top: 1px solid var(--color-border);
	}

	.evidence-heading {
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		gap: 1rem;
		align-content: start;
	}

	.evidence-heading > span,
	.evidence-heading p,
	.type-roles span,
	.proof-label,
	.accessibility-proof > span {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.evidence-heading > span,
	.evidence-heading p,
	.proof-label {
		color: var(--color-accent);
	}

	.evidence-heading p {
		margin: 0 0 0.4rem;
	}

	.evidence-heading h4 {
		font-size: clamp(1.5rem, 2.5vw, 2.4rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.palette,
	.type-roles,
	.component-evidence,
	.component-evidence ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.palette {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1px;
		background: var(--color-border);
		border: 1px solid var(--color-border);
	}

	.palette li {
		display: grid;
		grid-template-rows: auto auto 1fr;
		min-width: 0;
		padding: 0;
		background: var(--color-bg);
	}

	.palette i {
		display: block;
		width: calc(100% - 1.4rem);
		aspect-ratio: 1.6;
		margin: 0.7rem 0.7rem 0;
		border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
	}

	.palette li > div {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.9rem 1rem 0;
	}

	.palette strong {
		font-size: 0.92rem;
	}

	.palette code {
		padding: 0;
		background: transparent;
		color: var(--color-text-muted);
		font-size: 0.72rem;
	}

	.palette p {
		margin: 0;
		padding: 0.45rem 1rem 1rem;
		color: var(--color-text-muted);
		font-size: 0.82rem;
		line-height: 1.35;
	}

	.type-roles {
		border-top: 1px solid var(--color-border);
	}

	.type-roles li {
		display: grid;
		grid-template-columns: minmax(8rem, 0.55fr) minmax(10rem, 0.8fr) minmax(0, 1.3fr);
		gap: 1rem;
		padding-block: 1.35rem;
		border-bottom: 1px solid var(--color-border);
	}

	.type-roles span {
		color: var(--color-text-muted);
	}

	.type-roles strong {
		font-size: clamp(1.25rem, 2vw, 1.8rem);
		line-height: 1.05;
	}

	.type-roles p,
	.component-evidence > li > p,
	.proof-copy > p,
	.accessibility-proof p {
		margin: 0;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.component-evidence {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 1px;
		background: var(--color-border);
		border: 1px solid var(--color-border);
	}

	.component-story {
		display: grid;
		gap: clamp(1rem, 2vw, 1.5rem);
		min-width: 0;
	}

	.component-snapshot {
		margin: 0;
		padding: clamp(1.25rem, 2.5vw, 2.25rem);
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
	}

	.component-snapshot img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
	}

	.component-snapshot picture {
		display: block;
	}

	.component-snapshot--fritz picture {
		overflow: hidden;
	}

	.component-snapshot--fritz img {
		transform: translateY(-8.5%) scale(1.04);
		transform-origin: center;
	}

	.component-snapshot figcaption {
		margin-top: 1rem;
		color: var(--color-text-muted);
		font-family: var(--font-family-mono);
		font-size: 0.68rem;
		letter-spacing: 0.04em;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.component-evidence > li {
		display: flex;
		min-width: 0;
		min-height: 15rem;
		flex-direction: column;
		padding: clamp(1.35rem, 2.25vw, 2rem);
		background: var(--color-bg-subtle);
	}

	.component-evidence h5,
	.proof-copy h5 {
		font-size: clamp(1.4rem, 2.5vw, 2.2rem);
		line-height: 1.02;
		letter-spacing: -0.04em;
	}

	.component-evidence > li > p {
		margin-top: 1rem;
	}

	.component-evidence ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: auto;
		padding-top: 2rem;
	}

	.component-evidence ul li {
		margin: 0;
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-pill);
		color: var(--color-text-muted);
		font-family: var(--font-family-mono);
		font-size: 0.68rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.proof-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
		gap: 1px;
		background: var(--color-border);
		border: 1px solid var(--color-border);
	}

	.proof-image {
		min-height: 28rem;
		overflow: hidden;
		background: var(--color-bg-subtle);
	}

	.proof-image picture,
	.proof-image img {
		display: block;
		width: 100%;
	}

	.proof-image picture {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.proof-image img {
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: contain;
		object-position: center;
	}

	.proof-image--full-bleed img {
		height: 100%;
		aspect-ratio: auto;
		object-fit: cover;
	}

	.proof-image--fritz img {
		transform: translateX(3%) scale(1.25);
		transform-origin: center;
	}

	.proof-copy {
		display: flex;
		flex-direction: column;
		padding: clamp(1.5rem, 3vw, 2.5rem);
		background: var(--color-bg-subtle);
	}

	.proof-copy h5 {
		margin: 1.2rem 0;
	}

	.proof-copy h5 + p {
		padding-bottom: clamp(2rem, 4vw, 3rem);
	}

	.accessibility-proof {
		margin-top: auto;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}

	.accessibility-proof > span {
		display: block;
		margin-bottom: 0.75rem;
		color: var(--color-text-muted);
	}

	.accessibility-proof strong {
		display: block;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 64rem) {
		.principles {
			grid-template-columns: 1fr;
		}

		.principles li:nth-child(odd),
		.principles li:nth-child(even) {
			padding-inline: 0;
			border-right: 0;
		}

		.principles li:nth-last-child(2):nth-child(odd) {
			border-bottom: 1px solid var(--color-border);
		}

		.palette {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.proof-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 48rem) {
		.story-header,
		.fingerprint-heading,
		.evidence-section {
			grid-template-columns: 1fr;
		}

		.fingerprint-heading .eyebrow {
			grid-row: auto;
		}

		.type-roles li {
			grid-template-columns: 1fr 1.5fr;
		}

		.type-roles p {
			grid-column: 2;
		}
	}

	@media (max-width: 40rem) {
		.design-system {
			width: min(100% - 1.25rem, 94rem);
		}

		.principles li {
			grid-template-columns: 2rem 1fr;
		}

		.principles p {
			grid-column: 2;
		}

		.palette {
			grid-template-columns: 1fr 1fr;
		}

		.component-evidence {
			grid-template-columns: 1fr;
		}

		.palette li > div,
		.type-roles li {
			grid-template-columns: 1fr;
			flex-direction: column;
		}

		.type-roles p {
			grid-column: auto;
		}

		.proof-image {
			min-height: 18rem;
		}
	}
</style>
