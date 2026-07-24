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

	@media (prefers-reduced-motion: reduce) {
		.visual img {
			transition: none;
		}
	}
</style>
