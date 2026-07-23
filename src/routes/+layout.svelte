<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';
	import '$lib/styles/layout.css';
	import '$lib/styles/controls.css';
	import '$lib/styles/a11y.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#e9e8e2" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#191918" media="(prefers-color-scheme: dark)" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to main content</a>

<header class="site-header">
	<div class="site-header__inner">
		<a class="wordmark" href="/" aria-label="Pete Nawara, home">
			<span>Pete Nawara</span>
			<small>Creative Technologist</small>
		</a>

		<nav aria-label="Primary navigation">
			<a href="/#work">Work</a>
			<a href="/#practice">Practice</a>
			<a href="/#about">About</a>
			<a href="/system">System</a>
			<a href="mailto:pete@petenawara.com">Contact</a>
		</nav>
	</div>
</header>

<main id="main-content" tabindex="-1">
	{@render children()}
</main>

<footer class="site-footer">
	<p>Product design · Visual systems · Frontend engineering</p>
	<div>
		<a href="mailto:pete@petenawara.com">pete@petenawara.com</a>
		<a href="/system">View the design system</a>
		<a href="https://github.com/petebot" rel="me noopener" target="_blank">GitHub ↗</a>
	</div>
	<small>© {new Date().getFullYear()} Pete Nawara</small>
</footer>

<style>
	.site-header__inner,
	.site-footer {
		width: min(100% - 2rem, 94rem);
		margin-inline: auto;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: var(--color-bg);
		background: var(--header-bg);
		backdrop-filter: blur(1rem) saturate(120%);
		-webkit-backdrop-filter: blur(1rem) saturate(120%);
		border-bottom: var(--border-width-structure) solid var(--color-border);
	}

	.site-header__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 4.75rem;
		gap: 2rem;
	}

	.wordmark {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: var(--target-size-min);
		gap: 0.15rem;
		font-size: 0.98rem;
		font-weight: 650;
		line-height: 1;
		letter-spacing: -0.025em;
	}

	.wordmark small {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		font-weight: 400;
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	nav {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-end;
		gap: 0.25rem;
	}

	nav a,
	.wordmark,
	.site-footer a {
		color: var(--color-text);
		text-decoration: none;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: var(--target-size-min);
		padding-inline: 0.7rem;
		font-family: var(--font-family-mono);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	nav a:hover,
	nav a:focus-visible,
	.wordmark:hover,
	.wordmark:focus-visible,
	.site-footer a:hover,
	.site-footer a:focus-visible {
		color: var(--color-accent);
		background: transparent;
	}

	.site-footer {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 3rem;
		padding-block: 4rem 2rem;
		border-top: var(--border-width-structure) solid var(--color-border);
	}

	.site-footer p {
		max-width: 26rem;
		font-size: clamp(1.3rem, 2.2vw, 2rem);
		line-height: 1.12;
		letter-spacing: -0.035em;
	}

	.site-footer div {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.35rem;
	}

	.site-footer small {
		grid-column: 1 / -1;
		color: var(--color-text-muted);
	}

	@media (max-width: 48rem) {
		.site-header__inner {
			display: grid;
			grid-template-columns: 1fr;
			gap: 0;
			padding-top: 0.8rem;
		}

		nav {
			justify-content: flex-start;
			overflow-x: auto;
			overscroll-behavior-inline: contain;
			scrollbar-width: none;
		}

		nav::-webkit-scrollbar {
			display: none;
		}

		nav a:first-child {
			padding-left: 0;
		}
	}

	@media (max-width: 40rem) {
		.site-header__inner,
		.site-footer {
			width: min(100% - 1.25rem, 94rem);
		}

		.site-footer {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.site-footer div {
			align-items: flex-start;
		}

		.site-footer small {
			grid-column: auto;
		}
	}
</style>
