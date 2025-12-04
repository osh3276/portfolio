<script lang="ts">
	import type { PostData } from '$lib/types';

	export let data: { posts: PostData[] };
</script>

<main>
	<h1 class="mb-10">blog</h1>
	{#each data.posts as post (post.title)}
		<div class="mt-2 flex justify-between">
			<a href={`${post.path}`}>
				<p>
					{post.title}{post.subtitle ? `: ${post.subtitle}` : ''}
				</p>
			</a>
			<p class="font-[var(--fg-2)]">{post.date}</p>
		</div>
	{/each}
</main>
