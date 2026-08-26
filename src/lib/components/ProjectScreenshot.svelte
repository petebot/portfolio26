<script lang="ts">
	interface ProjectImage {
		url: string;
		compactUrl?: string;
		compactAlt?: string;
		frame?: 'plain' | 'phone' | 'browser';
		compactFrame?: 'plain' | 'phone' | 'browser';
		compactFrameLabel?: string;
		lightUrl?: string;
		darkUrl?: string;
		alt?: string;
	}

	let {
		slug,
		image,
		compact = false,
		frame: frameOverride,
		frameLabel: frameLabelOverride,
		cursorLabel
	}: {
		slug: string;
		image?: ProjectImage;
		compact?: boolean;
		frame?: 'plain' | 'phone' | 'browser';
		frameLabel?: string;
		cursorLabel?: string;
	} = $props();

	let cursorLabelVisible = $state(false);
	let cursorLabelX = $state(0);
	let cursorLabelY = $state(0);

	function positionCursorLabel(event: PointerEvent) {
		if (!cursorLabel || event.pointerType === 'touch') return;

		const visual = event.currentTarget as HTMLElement;
		const bounds = visual.getBoundingClientRect();
		const pointerX = event.clientX - bounds.left;
		const pointerY = event.clientY - bounds.top;
		const placeLeft = pointerX > bounds.width - 10 * 16;
		const placeAbove = pointerY > bounds.height - 3.5 * 16;

		cursorLabelX = pointerX + (placeLeft ? -7.25 * 16 : 1 * 16);
		cursorLabelY = pointerY + (placeAbove ? -2.5 * 16 : 1 * 16);
		cursorLabelVisible = true;
	}

	const usesCompactSource = $derived(Boolean(compact && image?.compactUrl));
	const versionedSource = $derived(
		image ? `${usesCompactSource ? image.compactUrl : image.url}?v=20260826-display-fit` : undefined
	);
	const versionedLightSource = $derived(
		!usesCompactSource && image?.lightUrl ? `${image.lightUrl}?v=20260826-display-fit` : undefined
	);
	const versionedDarkSource = $derived(
		!usesCompactSource && image?.darkUrl ? `${image.darkUrl}?v=20260826-display-fit` : undefined
	);
	const imageAlt = $derived(
		usesCompactSource ? (image?.compactAlt ?? image?.alt ?? '') : (image?.alt ?? '')
	);
	const frame = $derived(
		frameOverride ??
			(compact ? (image?.compactFrame ?? image?.frame ?? 'plain') : (image?.frame ?? 'plain'))
	);
	const frameLabel = $derived(
		frameLabelOverride ?? image?.compactFrameLabel ?? slug.replaceAll('-', ' ')
	);
	const frameBackground = $derived(
		versionedSource ? `--frame-image: url("${versionedSource}")` : undefined
	);
</script>

{#snippet screenshot()}
	<picture>
		{#if versionedDarkSource}
			<source srcset={versionedDarkSource} media="(prefers-color-scheme: dark)" />
		{/if}
		{#if versionedLightSource}
			<source srcset={versionedLightSource} media="(prefers-color-scheme: light)" />
		{/if}
		<img src={versionedSource} alt={imageAlt} loading={compact ? 'lazy' : 'eager'} />
	</picture>
{/snippet}

<div
	class:compact
	class="visual"
	data-project={slug}
	data-frame={frame}
	style={frameBackground}
	onpointermove={positionCursorLabel}
	onpointerleave={() => (cursorLabelVisible = false)}
>
	{#if image && versionedSource}
		{#if frame === 'phone'}
			<div class="device device--phone">
				<span class="device__button device__button--volume" aria-hidden="true"></span>
				<span class="device__button device__button--power" aria-hidden="true"></span>
				<div class="device__screen">{@render screenshot()}</div>
				<span class="device__island" aria-hidden="true"></span>
			</div>
		{:else if frame === 'browser'}
			<div class="device device--browser">
				<div class="device__bar" aria-hidden="true">
					<span class="device__dots"><i></i><i></i><i></i></span>
					<span class="device__address">{frameLabel}</span>
				</div>
				<div class="device__screen">{@render screenshot()}</div>
			</div>
		{:else}
			{@render screenshot()}
		{/if}
	{:else}
		<div class="fallback" aria-hidden="true">{slug.replaceAll('-', ' ')}</div>
	{/if}
	{#if cursorLabel}
		<span
			class:visible={cursorLabelVisible}
			class="cursor-label"
			style={`--cursor-label-x: ${cursorLabelX}px; --cursor-label-y: ${cursorLabelY}px;`}
			aria-hidden="true">{cursorLabel}</span
		>
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

	.visual > picture,
	.device__screen picture,
	.visual img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.visual > picture {
		position: absolute;
		inset: 0;
	}

	.visual[data-frame='phone'],
	.visual[data-frame='browser'] {
		display: grid;
		place-items: center;
		isolation: isolate;
	}

	.visual[data-frame='phone'] {
		background: #211f24;
	}

	.visual[data-frame='phone']::before,
	.visual[data-frame='phone']::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.visual[data-frame='phone']::before {
		inset: -2rem;
		background: var(--frame-image) center / cover;
		filter: blur(1.5rem) saturate(0.78);
		opacity: 0.48;
		transform: scale(1.12);
	}

	.visual[data-frame='phone']::after {
		background:
			radial-gradient(circle at 50% 45%, transparent 0 28%, rgb(14 12 16 / 18%) 70%),
			linear-gradient(90deg, rgb(18 16 20 / 28%), transparent 45% 55%, rgb(18 16 20 / 28%));
	}

	.device {
		position: relative;
		z-index: 1;
	}

	.device--phone {
		height: calc(100% - 1.1rem);
		aspect-ratio: 428 / 868;
		border: 0.08rem solid rgb(255 255 255 / 42%);
		border-radius: 2rem;
		background: linear-gradient(145deg, #77717c 0%, #1a181d 28% 72%, #59545d 100%);
		box-shadow:
			inset 0 0 0 0.16rem #0f0e11,
			inset 0 0 0 0.23rem rgb(255 255 255 / 13%),
			0 1.15rem 2.1rem rgb(8 7 9 / 46%);
		transform: rotate(-1.1deg);
	}

	.device--phone .device__screen {
		position: absolute;
		inset: 0.38rem;
		overflow: hidden;
		border-radius: 1.64rem;
		background: #151318;
	}

	.device--phone img {
		object-fit: cover;
		object-position: center top;
	}

	.device__island {
		position: absolute;
		top: 0.68rem;
		left: 50%;
		width: 25%;
		height: 0.36rem;
		border-radius: 999px;
		background: #080709;
		box-shadow: 0 0 0 1px rgb(255 255 255 / 5%);
		transform: translateX(-50%);
	}

	.device__button {
		position: absolute;
		width: 0.12rem;
		border-radius: 999px;
		background: #302c33;
	}

	.device__button--volume {
		top: 24%;
		left: -0.15rem;
		height: 14%;
		box-shadow: 0 2.1rem 0 #302c33;
	}

	.device__button--power {
		top: 29%;
		right: -0.15rem;
		height: 18%;
	}

	.visual[data-frame='browser'] {
		background:
			linear-gradient(135deg, rgb(255 255 255 / 58%), rgb(255 255 255 / 18%)),
			var(--color-surface-muted);
	}

	.visual:not(.compact)[data-frame='browser'] {
		aspect-ratio: auto;
		overflow: visible;
		padding: clamp(1.25rem, 3vw, 2rem);
		background: transparent;
		cursor: default;
	}

	.visual:not(.compact)[data-frame='browser'] .device--browser {
		width: 100%;
		height: auto;
	}

	.visual:not(.compact)[data-frame='browser'] .device__screen {
		aspect-ratio: 16 / 9;
	}

	.device--browser {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		width: calc(100% - 1.1rem);
		height: calc(100% - 1.1rem);
		overflow: hidden;
		border: 1px solid rgb(25 25 24 / 28%);
		border-radius: 0.65rem;
		background: #f7f7f4;
		box-shadow:
			0 0.55rem 1.2rem rgb(25 25 24 / 20%),
			0 0.08rem 0 rgb(255 255 255 / 82%) inset;
	}

	.device__bar {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.65rem;
		min-height: 1.65rem;
		padding-inline: 0.65rem;
		border-bottom: 1px solid rgb(25 25 24 / 17%);
		background: #e8e8e4;
		color: #555551;
	}

	.device__dots {
		display: flex;
		gap: 0.26rem;
	}

	.device__dots i {
		width: 0.34rem;
		height: 0.34rem;
		border-radius: 50%;
		background: #817f79;
	}

	.device__dots i:nth-child(2) {
		opacity: 0.66;
	}

	.device__dots i:nth-child(3) {
		opacity: 0.4;
	}

	.device__address {
		grid-column: 2;
		justify-self: center;
		overflow: hidden;
		font-family: var(--font-family-mono);
		font-size: 0.55rem;
		letter-spacing: 0.08em;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.device--browser .device__screen {
		position: relative;
		min-height: 0;
		overflow: hidden;
	}

	.device--browser img {
		object-fit: cover;
		object-position: center top;
	}

	.visual img {
		object-fit: cover;
		object-position: center top;
		transition: transform 500ms var(--transition-ease-standard);
	}

	.visual[data-project='fritz'] img {
		object-position: center 58%;
	}

	.cursor-label {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--color-border-strong);
		background: var(--color-text);
		box-shadow: var(--shadow-elevation-2);
		color: var(--color-bg);
		font-family: var(--font-family-mono);
		font-size: 0.6875rem;
		letter-spacing: var(--letter-spacing-label);
		line-height: 1;
		opacity: 0;
		pointer-events: none;
		text-transform: uppercase;
		transform: translate(var(--cursor-label-x), var(--cursor-label-y));
		white-space: nowrap;
	}

	.cursor-label.visible {
		opacity: 1;
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

	@media (max-width: 52rem) {
		.visual[data-frame='phone'].compact {
			aspect-ratio: 4 / 3;
		}

		.device--phone {
			height: calc(100% - 0.7rem);
		}
	}

	@media (max-width: 40rem) {
		.device--phone {
			border-width: 0.05rem;
			border-radius: 1.45rem;
			box-shadow:
				inset 0 0 0 0.11rem #0f0e11,
				0 0.75rem 1.3rem rgb(8 7 9 / 38%);
		}

		.device--phone .device__screen {
			inset: 0.26rem;
			border-radius: 1.22rem;
		}

		.device__island,
		.device__button {
			display: none;
		}

		.device--browser {
			width: calc(100% - 0.65rem);
			height: calc(100% - 0.65rem);
			border-radius: 0.48rem;
		}

		.device__bar {
			min-height: 1.35rem;
		}
	}

	.visual[data-project='driftline'] .fallback {
		justify-items: start;
		align-content: end;
		background:
			linear-gradient(
				90deg,
				transparent 0 24.85%,
				rgb(125 211 199 / 22%) 25% 25.15%,
				transparent 25.3% 100%
			),
			linear-gradient(
				0deg,
				transparent 0 24.85%,
				rgb(125 211 199 / 16%) 25% 25.15%,
				transparent 25.3% 100%
			),
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

		.cursor-label {
			display: none;
		}
	}

	@media (hover: none), (pointer: coarse) {
		.cursor-label {
			display: none;
		}
	}

	@media (forced-colors: active) {
		.visual[data-frame='phone']::before,
		.visual[data-frame='phone']::after {
			display: none;
		}

		.device--phone,
		.device--browser,
		.device__bar {
			border-color: CanvasText;
			background: Canvas;
			box-shadow: none;
			color: CanvasText;
		}

		.device__island,
		.device__button,
		.device__dots i {
			background: CanvasText;
		}
	}
</style>
