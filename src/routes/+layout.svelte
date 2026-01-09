<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/a11y.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to main content</a>

<main id="main-content" tabindex="-1">
	{@render children()}
</main>
