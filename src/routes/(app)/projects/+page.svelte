<script lang="ts">
	import Card from '$lib/card.svelte';
	import Masonry from 'svelte-bricks';
	import type { ProjectData } from '$lib/types';
	import projectJson from './projects.json';

	let projects: ProjectData[] = projectJson;
	let items = $derived(projects.map((p) => ({ ...p, id: p.href })));
	let [minColWidth, maxColWidth, gap] = [250, 800, 20];
</script>

<div class="mx-auto mb-10 max-w-3xl pt-6">
	<h1 class="mb-10">projects</h1>
	<section>
		<p>a collection of some of the things i've made.</p>
	</section>
</div>

<section class="mx-auto max-w-5xl">
	<div class="project-container">
		<Masonry {items} {minColWidth} {maxColWidth} {gap}>
			{#snippet children({ item })}
				<Card
					href={item.href}
					imageSrc={item.imageSrc}
					title={item.title}
					subtitle={item.subtitle}
				/>
			{/snippet}
		</Masonry>
	</div>
</section>

<style>
	.project-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: center;
		justify-content: center;
	}
</style>
