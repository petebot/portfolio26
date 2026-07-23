<script lang="ts">
	import type { DesignSystemSummary } from '$lib/server/projects';

	let { system }: { system: DesignSystemSummary } = $props();

	const statusLabel = $derived(system.status.charAt(0).toUpperCase() + system.status.slice(1));
</script>

<section class="design-system" aria-labelledby="design-system-title">
	<header>
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
</section>

<style>
	.design-system {
		width: min(100% - 2rem, 94rem);
		margin-inline: auto;
		padding-block: clamp(1rem, 3vw, 3rem) clamp(5rem, 11vw, 10rem);
	}

	header {
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
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--color-border);
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

	@media (max-width: 64rem) {
		.principles {
			grid-template-columns: 1fr;
		}

		.principles li:nth-child(odd),
		.principles li:nth-child(even) {
			padding-inline: 0;
			border-right: 0;
		}
	}

	@media (max-width: 48rem) {
		header {
			grid-template-columns: 1fr;
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
	}
</style>
