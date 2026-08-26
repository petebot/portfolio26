<script lang="ts">
	import { onMount } from 'svelte';

	let field: HTMLDivElement;

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const coarsePointer = window.matchMedia('(pointer: coarse)');
		let frame = 0;
		let lastFrame = 0;
		let currentX = 0;
		let currentY = 0;
		let targetX = 0;
		let targetY = 0;
		let velocityX = 0;
		let velocityY = 0;
		let hasPosition = false;

		const paint = (time: number) => {
			const delta = lastFrame ? Math.min((time - lastFrame) / (1000 / 60), 2) : 1;
			lastFrame = time;

			const spring = 0.045 * delta;
			const damping = Math.pow(0.76, delta);

			velocityX = (velocityX + (targetX - currentX) * spring) * damping;
			velocityY = (velocityY + (targetY - currentY) * spring) * damping;
			currentX += velocityX * delta;
			currentY += velocityY * delta;

			const distance = Math.hypot(targetX - currentX, targetY - currentY);
			const speed = Math.hypot(velocityX, velocityY);

			if (distance < 0.08 && speed < 0.08) {
				currentX = targetX;
				currentY = targetY;
				velocityX = 0;
				velocityY = 0;
				frame = 0;
			} else {
				frame = window.requestAnimationFrame(paint);
			}

			field.style.setProperty('--field-x', `${currentX}px`);
			field.style.setProperty('--field-y', `${currentY}px`);
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (event.pointerType === 'touch' || reducedMotion.matches || coarsePointer.matches) {
				return;
			}

			const bounds = field.getBoundingClientRect();
			const isInside =
				event.clientX >= bounds.left &&
				event.clientX <= bounds.right &&
				event.clientY >= bounds.top &&
				event.clientY <= bounds.bottom;

			if (!isInside) {
				field.removeAttribute('data-active');
				return;
			}

			targetX = event.clientX - bounds.left;
			targetY = event.clientY - bounds.top;

			if (!hasPosition) {
				currentX = targetX;
				currentY = targetY;
				hasPosition = true;
				field.style.setProperty('--field-x', `${currentX}px`);
				field.style.setProperty('--field-y', `${currentY}px`);
			}

			field.setAttribute('data-active', '');

			if (!frame) {
				lastFrame = 0;
				frame = window.requestAnimationFrame(paint);
			}
		};

		const handlePointerOut = () => {
			field.removeAttribute('data-active');
			velocityX = 0;
			velocityY = 0;
		};

		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		window.addEventListener('blur', handlePointerOut);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('blur', handlePointerOut);
			if (frame) window.cancelAnimationFrame(frame);
		};
	});
</script>

<div class="hero-field" bind:this={field} aria-hidden="true">
	<i class="hero-field__base"></i>
	<i class="hero-field__response"></i>
	<i class="hero-field__glow"></i>
</div>

<style>
	.hero-field {
		--field-x: 68%;
		--field-y: 44%;
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.hero-field i {
		position: absolute;
		inset: -2rem;
		display: block;
	}

	.hero-field__base,
	.hero-field__response {
		background-image: radial-gradient(circle, currentColor 1px, transparent 1.3px);
		background-position: center;
		background-size: clamp(1.45rem, 2vw, 2rem) clamp(1.45rem, 2vw, 2rem);
		mask-image: linear-gradient(105deg, transparent 4%, #000 34%, #000 86%, transparent 100%);
	}

	.hero-field__base {
		color: var(--color-text);
		opacity: 0.085;
	}

	.hero-field__response {
		color: var(--color-accent);
		opacity: 0;
		mask-image: radial-gradient(
			circle 14rem at var(--field-x) var(--field-y),
			#000 0%,
			rgb(0 0 0 / 86%) 34%,
			transparent 74%
		);
		transition: opacity 220ms ease;
	}

	.hero-field__glow {
		inset: 0;
		background: radial-gradient(
			circle 11rem at var(--field-x) var(--field-y),
			color-mix(in srgb, var(--color-accent) 14%, transparent),
			transparent 72%
		);
		opacity: 0;
		transition: opacity 220ms ease;
	}

	:global(.hero-field[data-active]) .hero-field__response {
		opacity: 0.72;
	}

	:global(.hero-field[data-active]) .hero-field__glow {
		opacity: 1;
	}

	@media (max-width: 40rem) {
		.hero-field__base {
			opacity: 0.06;
		}
	}

	@media (prefers-reduced-motion: reduce), (pointer: coarse) {
		.hero-field__response,
		.hero-field__glow {
			display: none;
		}
	}

	@media (forced-colors: active) {
		.hero-field {
			display: none;
		}
	}
</style>
