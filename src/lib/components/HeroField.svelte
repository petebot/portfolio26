<script lang="ts">
	import { onMount } from 'svelte';

	const GLYPHS = [
		'⠁',
		'⠂',
		'⠄',
		'⠈',
		'⠐',
		'⠠',
		'⡀',
		'⢀',
		'⠃',
		'⠅',
		'⠊',
		'⠒',
		'⠤',
		'⠦',
		'⠴',
		'⠶',
		'⠿'
	];

	let field: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let accentProbe: HTMLSpanElement;

	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const coarsePointer = window.matchMedia('(pointer: coarse)');
		const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

		let frame = 0;
		let lastFrame = 0;
		let lastDraw = 0;
		let width = 0;
		let height = 0;
		let pixelRatio = 1;
		let visible = false;
		let pointerActive = false;
		let hasPosition = false;
		let currentX = 0;
		let currentY = 0;
		let targetX = 0;
		let targetY = 0;
		let velocityX = 0;
		let velocityY = 0;
		let textColor = 'rgb(24 24 23)';
		let accentColor = 'rgb(126 98 22)';
		let fontFamily = 'monospace';

		const refreshStyles = () => {
			const fieldStyles = window.getComputedStyle(field);
			textColor = fieldStyles.color;
			accentColor = window.getComputedStyle(accentProbe).color;
			fontFamily = fieldStyles.getPropertyValue('--font-family-mono').trim() || 'monospace';
		};

		const draw = (time: number) => {
			if (!width || !height) return;

			context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
			context.clearRect(0, 0, width, height);

			const cellSize = width <= 640 ? 23 : 27;
			const columns = Math.ceil(width / cellSize) + 1;
			const rows = Math.ceil(height / cellSize) + 1;
			const fontSize = Math.max(9, cellSize * 0.46);
			const motionTime = reducedMotion.matches ? 0 : time;

			context.font = `${fontSize}px ${fontFamily}`;
			context.textAlign = 'center';
			context.textBaseline = 'middle';

			for (let row = 0; row < rows; row += 1) {
				for (let column = 0; column < columns; column += 1) {
					const x = column * cellSize + cellSize / 2;
					const y = row * cellSize + cellSize / 2;
					const ambient =
						Math.sin(column * 0.31 + motionTime * 0.00019) +
						Math.cos(row * 0.36 - motionTime * 0.00016) +
						Math.sin((column + row) * 0.14 + motionTime * 0.00011);
					const normalizedAmbient = (ambient + 3) / 6;
					const pointerDistance = Math.hypot(x - currentX, y - currentY);
					const pointerInfluence = pointerActive
						? Math.max(0, 1 - pointerDistance / Math.min(270, width * 0.28))
						: 0;
					const ripple = pointerInfluence * Math.sin(pointerDistance * 0.045 - motionTime * 0.0032);
					const energy = Math.max(
						0,
						Math.min(1, normalizedAmbient * 0.52 + pointerInfluence * 0.48 + ripple * 0.14)
					);
					const glyph = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(energy * GLYPHS.length))];

					context.globalAlpha = 0.045 + normalizedAmbient * 0.075 + pointerInfluence * 0.32;
					context.fillStyle = pointerInfluence > 0.06 ? accentColor : textColor;
					context.fillText(glyph, x, y);
				}
			}

			context.globalAlpha = 1;
		};

		const paint = (time: number) => {
			if (!visible) {
				frame = 0;
				return;
			}

			const delta = lastFrame ? Math.min((time - lastFrame) / (1000 / 60), 2) : 1;
			lastFrame = time;

			if (pointerActive) {
				const spring = 0.045 * delta;
				const damping = Math.pow(0.76, delta);

				velocityX = (velocityX + (targetX - currentX) * spring) * damping;
				velocityY = (velocityY + (targetY - currentY) * spring) * damping;
				currentX += velocityX * delta;
				currentY += velocityY * delta;

				if (
					Math.hypot(targetX - currentX, targetY - currentY) < 0.08 &&
					Math.hypot(velocityX, velocityY) < 0.08
				) {
					currentX = targetX;
					currentY = targetY;
					velocityX = 0;
					velocityY = 0;
				}

				field.style.setProperty('--field-x', `${currentX}px`);
				field.style.setProperty('--field-y', `${currentY}px`);
			}

			if (!lastDraw || time - lastDraw >= 1000 / 45) {
				draw(time);
				lastDraw = time;
			}
			frame = window.requestAnimationFrame(paint);
		};

		const start = () => {
			if (!visible || reducedMotion.matches || frame) return;
			lastFrame = 0;
			frame = window.requestAnimationFrame(paint);
		};

		const resize = () => {
			const bounds = canvas.getBoundingClientRect();
			width = Math.max(1, bounds.width);
			height = Math.max(1, bounds.height);
			pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

			const nextWidth = Math.round(width * pixelRatio);
			const nextHeight = Math.round(height * pixelRatio);
			if (canvas.width !== nextWidth) canvas.width = nextWidth;
			if (canvas.height !== nextHeight) canvas.height = nextHeight;

			refreshStyles();
			draw(window.performance.now());
		};

		const deactivatePointer = () => {
			pointerActive = false;
			hasPosition = false;
			velocityX = 0;
			velocityY = 0;
			field.removeAttribute('data-active');
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (event.pointerType === 'touch' || reducedMotion.matches || coarsePointer.matches) return;

			const fieldBounds = field.getBoundingClientRect();
			const isInside =
				event.clientX >= fieldBounds.left &&
				event.clientX <= fieldBounds.right &&
				event.clientY >= fieldBounds.top &&
				event.clientY <= fieldBounds.bottom;

			if (!isInside) {
				deactivatePointer();
				return;
			}

			const canvasBounds = canvas.getBoundingClientRect();
			targetX = event.clientX - canvasBounds.left;
			targetY = event.clientY - canvasBounds.top;

			if (!hasPosition) {
				currentX = targetX;
				currentY = targetY;
				hasPosition = true;
				field.style.setProperty('--field-x', `${currentX}px`);
				field.style.setProperty('--field-y', `${currentY}px`);
			}

			pointerActive = true;
			field.setAttribute('data-active', '');
			start();
		};

		const handleMotionPreference = () => {
			if (reducedMotion.matches) {
				if (frame) window.cancelAnimationFrame(frame);
				frame = 0;
				deactivatePointer();
				draw(0);
			} else {
				start();
			}
		};

		const handleThemeChange = () => {
			refreshStyles();
			draw(window.performance.now());
		};

		const resizeObserver = new ResizeObserver(resize);
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) start();
			else if (frame) {
				window.cancelAnimationFrame(frame);
				frame = 0;
			}
		});
		const themeObserver = new MutationObserver(() => {
			refreshStyles();
			draw(window.performance.now());
		});

		resizeObserver.observe(canvas);
		intersectionObserver.observe(field);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'style', 'class']
		});
		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		window.addEventListener('blur', deactivatePointer);
		reducedMotion.addEventListener('change', handleMotionPreference);
		colorScheme.addEventListener('change', handleThemeChange);
		resize();

		return () => {
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			themeObserver.disconnect();
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('blur', deactivatePointer);
			reducedMotion.removeEventListener('change', handleMotionPreference);
			colorScheme.removeEventListener('change', handleThemeChange);
			if (frame) window.cancelAnimationFrame(frame);
		};
	});
</script>

<div class="hero-field" bind:this={field} aria-hidden="true">
	<div class="hero-field__viewport">
		<canvas bind:this={canvas}></canvas>
		<i class="hero-field__glow"></i>
		<span class="hero-field__accent" bind:this={accentProbe}></span>
	</div>
</div>

<style>
	.hero-field {
		--field-x: 68%;
		--field-y: 44%;
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: clip;
		color: var(--color-text);
		mask-image: linear-gradient(to bottom, #000 0%, #000 calc(100% - 14rem), transparent 100%);
		pointer-events: none;
	}

	.hero-field__viewport {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: hidden;
	}

	.hero-field canvas,
	.hero-field__glow {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hero-field canvas {
		display: block;
	}

	.hero-field__glow {
		background: radial-gradient(
			circle 11rem at var(--field-x) var(--field-y),
			color-mix(in srgb, var(--color-accent) 11%, transparent),
			transparent 72%
		);
		opacity: 0;
		transition: opacity 220ms ease;
	}

	.hero-field__accent {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		color: var(--color-accent);
	}

	:global(.hero-field[data-active]) .hero-field__glow {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
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
