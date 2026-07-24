<script lang="ts">
	interface ProjectImage {
		url: string;
		lightUrl?: string;
		darkUrl?: string;
		alt?: string;
	}

	let {
		slug,
		image,
		compact = false
	}: { slug: string; image?: ProjectImage; compact?: boolean } = $props();

	const versionedSource = $derived(image ? `${image.url}?v=20260724-screenshots-2` : undefined);
	const versionedLightSource = $derived(
		image?.lightUrl ? `${image.lightUrl}?v=20260724-screenshots-2` : undefined
	);
	const versionedDarkSource = $derived(
		image?.darkUrl ? `${image.darkUrl}?v=20260724-screenshots-2` : undefined
	);
</script>

<div class:compact class="visual" data-project={slug}>
	{#if image && versionedSource}
		<picture>
			{#if versionedDarkSource}
				<source srcset={versionedDarkSource} media="(prefers-color-scheme: dark)" />
			{/if}
			{#if versionedLightSource}
				<source srcset={versionedLightSource} media="(prefers-color-scheme: light)" />
			{/if}
			<img src={versionedSource} alt={image.alt ?? ''} loading={compact ? 'lazy' : 'eager'} />
		</picture>
	{:else}
		<div class="fallback" aria-hidden="true">{slug.replaceAll('-', ' ')}</div>
	{/if}
</div>

<style>
	.visual {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--color-surface-muted);
	}

	.visual.compact {
		width: 100%;
	}

	.visual picture,
	.visual img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.visual img {
		object-fit: cover;
		object-position: center top;
		transition: transform 500ms var(--transition-ease-standard);
	}

	:global(.project-card:hover) .visual img,
	:global(.project-card:focus-visible) .visual img {
		transform: scale(1.0125);
	}

	.fallback {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 2rem;
		font-size: clamp(2rem, 8vw, 6rem);
		font-weight: 600;
		letter-spacing: -0.06em;
		text-transform: capitalize;
	}

	.visual[data-project='driftline'] .fallback {
		justify-items: start;
		align-content: end;
		background:
			linear-gradient(90deg, transparent 0 24.85%, rgb(125 211 199 / 22%) 25% 25.15%, transparent 25.3% 100%),
			linear-gradient(0deg, transparent 0 24.85%, rgb(125 211 199 / 16%) 25% 25.15%, transparent 25.3% 100%),
			#0b2427;
		color: #f2f5f2;
		font-family: var(--font-family-mono);
		font-size: clamp(2.4rem, 8vw, 7rem);
		font-weight: 500;
		letter-spacing: -0.07em;
		text-transform: none;
	}

	.visual[data-project='driftline'] .fallback::before {
		content: 'PORTFOLIO FLOW · MODEL AB-07';
		position: absolute;
		top: 1.25rem;
		left: 1.25rem;
		color: #7dd3c7;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.12em;
	}

	@media (prefers-reduced-motion: reduce) {
		.visual img {
			transition: none;
		}
	}
</style>
