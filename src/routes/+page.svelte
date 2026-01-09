<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { projects } = data;
</script>

<section>
	<header>
		<h1>Selected Work</h1>
		<p>Recent projects that are ready to share.</p>
	</header>

	{#if projects.length === 0}
		<p>Public case studies are coming soon. Check back for new launches.</p>
	{:else}
		<ul>
			{#each projects as project}
				<li>
					<article>
						<h2>{project.title}</h2>
						<p>{project.summary}</p>

						{#if project.tags && project.tags.length > 0}
							<ul>
								{#each project.tags as tag}
									<li>{tag}</li>
								{/each}
							</ul>
						{/if}

						{#if project.liveUrl}
							<p>
								<a href={project.liveUrl} rel="noopener" target="_blank">Visit site</a>
							</p>
						{/if}
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</section>
