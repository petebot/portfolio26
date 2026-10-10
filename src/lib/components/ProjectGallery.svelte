<script lang="ts">
	import type { ProjectGalleryImage } from '$lib/server/projects';

	let { images }: { images: ProjectGalleryImage[] } = $props();
</script>

<div class="project-gallery" class:project-gallery--pair={images.length === 2}>
	{#each images as image}
		<figure>
			<img
				src={image.url}
				alt={image.alt ?? ''}
				width={image.width}
				height={image.height}
				loading="lazy"
				decoding="async"
			/>
			{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
		</figure>
	{/each}
</div>

<style>
	.project-gallery {
		display: grid;
		gap: clamp(1.5rem, 3vw, 3rem);
		margin-block: 0 clamp(3rem, 7vw, 7rem);
	}

	figure {
		min-width: 0;
		margin: 0;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		background: var(--color-surface-muted);
	}

	figcaption {
		max-width: 65ch;
		margin-top: 1rem;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	@media (min-width: 52rem) {
		.project-gallery--pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
