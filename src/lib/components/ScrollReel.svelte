<script lang="ts">
	const frames = [
		{
			src: '/images/projects/synchronic-home.png?v=20260724-motion',
			label: 'Synchronic Studio',
			tone: '#aebde8'
		},
		{
			src: '/images/projects/letsworm-home.png?v=20260724-motion',
			label: 'Let’s Worm',
			tone: '#eab0c7'
		},
		{
			src: '/images/projects/grande-burrito-home.png?v=20260724-motion',
			label: 'Grande Burrito',
			tone: '#eecc55'
		},
		{
			src: '/images/projects/21grams-home.png?v=20260724-motion',
			label: '21GRAMS',
			tone: '#e8a57f'
		}
	];
</script>

<section class="reel" data-scroll-reel aria-labelledby="reel-title">
	<div class="reel__stage">
		<div class="reel__frames" aria-hidden="true">
			{#each frames as frame, index}
				<figure class="reel__frame" data-reel-frame style={`--frame-tone: ${frame.tone};`}>
					<img src={frame.src} alt="" loading="lazy" decoding="async" />
					<figcaption>
						<span>0{index + 1}</span>
						<span>{frame.label}</span>
					</figcaption>
				</figure>
			{/each}
		</div>

		<div class="reel__veil" aria-hidden="true"></div>

		<div class="reel__copy">
			<div class="reel__tag"><i></i><span>A moving practice</span></div>
			<div>
				<h2 id="reel-title">The work changes.<br />The through-line holds.</h2>
				<p>
					A scroll-linked study made from the current project archive. It is ready to become a
					portrait film when the shoot is ready.
				</p>
			</div>
		</div>

		<div class="reel__progress" aria-hidden="true">
			<span>Scroll to move through the work</span>
			<i><b data-reel-progress></b></i>
			<span>04</span>
		</div>
	</div>
</section>

<style>
	.reel {
		position: relative;
		height: 270svh;
		background: var(--color-punch-ink);
		color: var(--color-punch-paper);
	}

	.reel__stage {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: hidden;
		isolation: isolate;
	}

	.reel__frames,
	.reel__frame,
	.reel__veil {
		position: absolute;
		inset: 0;
	}

	.reel__frame {
		margin: 0;
		opacity: 0;
		background: var(--frame-tone);
	}

	.reel__frame:first-child {
		opacity: 1;
	}

	.reel__frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		filter: saturate(0.82) contrast(1.03);
		transform: scale(1.055);
	}

	.reel__frame figcaption {
		position: absolute;
		top: 5.8rem;
		right: max(1rem, calc((100vw - 94rem) / 2));
		display: flex;
		gap: 0.7rem;
		padding: 0.55rem 0.7rem;
		background: var(--frame-tone);
		color: var(--color-punch-ink);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.reel__veil {
		z-index: 1;
		background:
			linear-gradient(
				90deg,
				rgb(10 10 10 / 88%) 0%,
				rgb(10 10 10 / 58%) 62%,
				rgb(10 10 10 / 22%) 100%
			),
			linear-gradient(0deg, rgb(10 10 10 / 62%) 0%, transparent 48%);
		pointer-events: none;
	}

	.reel__copy,
	.reel__progress {
		position: absolute;
		z-index: 2;
		left: 50%;
		width: min(100% - 2rem, 94rem);
		transform: translateX(-50%);
	}

	.reel__copy {
		top: 0;
		bottom: 0;
		display: grid;
		grid-template-rows: auto 1fr;
		padding-block: clamp(6.5rem, 12vh, 9rem) 6rem;
	}

	.reel__copy > div:last-child {
		align-self: center;
	}

	.reel__tag {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
		color: rgb(244 240 230 / 76%);
	}

	.reel__tag i {
		width: 0.7rem;
		height: 0.18rem;
		background: var(--color-punch-orange);
	}

	.reel h2 {
		max-width: 62rem;
		margin-bottom: 2rem;
		font-size: clamp(3.3rem, 7vw, 7rem);
		line-height: 0.88;
		letter-spacing: -0.065em;
		color: var(--color-punch-paper);
	}

	.reel__copy p {
		max-width: 34rem;
		margin: 0;
		font-size: clamp(1rem, 1.4vw, 1.25rem);
		color: rgb(244 240 230 / 76%);
	}

	.reel__progress {
		bottom: 1.35rem;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		font-family: var(--font-family-mono);
		font-size: 0.68rem;
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.reel__progress i {
		height: 1px;
		overflow: hidden;
		background: rgb(244 240 230 / 38%);
	}

	.reel__progress b {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--color-punch-paper);
		transform: scaleX(0);
		transform-origin: left center;
	}

	@media (max-width: 40rem) {
		.reel {
			height: 220svh;
		}

		.reel__copy,
		.reel__progress {
			width: min(100% - 1.25rem, 94rem);
		}

		.reel__copy {
			padding-block: 8rem 5rem;
		}

		.reel__veil {
			background:
				linear-gradient(90deg, rgb(10 10 10 / 72%) 0%, rgb(10 10 10 / 28%) 100%),
				linear-gradient(0deg, rgb(10 10 10 / 72%) 0%, transparent 60%);
		}

		.reel__frame figcaption {
			top: 7rem;
			right: 0.625rem;
		}

		.reel__progress span:first-child {
			display: none;
		}

		.reel__progress {
			grid-template-columns: 1fr auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reel {
			height: auto;
			min-height: 42rem;
		}

		.reel__stage {
			position: relative;
			height: max(42rem, 100svh);
		}

		.reel__frame:not(:first-child),
		.reel__progress {
			display: none;
		}

		.reel__frame img {
			transform: none;
		}
	}

	:global([data-home-motion][data-motion='reduced']) .reel {
		height: auto;
		min-height: 42rem;
	}

	:global([data-home-motion][data-motion='reduced']) .reel__stage {
		position: relative;
		height: max(42rem, 100svh);
	}

	:global([data-home-motion][data-motion='reduced']) .reel__frame:not(:first-child),
	:global([data-home-motion][data-motion='reduced']) .reel__progress {
		display: none;
	}

	:global([data-home-motion][data-motion='reduced']) .reel__frame img {
		transform: none;
	}
</style>
