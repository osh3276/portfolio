<script context="module" lang="ts">
	let content = {
		languages: {
			web: ['js', 'ts', 'html', 'css'],
			scripting: ['python', 'bash', 'zsh'],
			embedded: ['c', 'c++'],
			other: ['java', 'sql'],
			'coming soon': ['rust']
		},
		tech: {
			frontend: ['next.js', 'react native', 'sveltekit', 'tailwind'],
			backend: ['node.js', 'express', 'postgresql', 'mongodb', 'spring', 'axum'],
			tools: ['docker', 'postman', 'git', 'dbeaver'],
			cloud: ['vercel', 'render', 'gcp', 'cloudinary'],
			ai: ['openai', 'google gemini'],
			os: ['macos sequoia', 'xubuntu 24.04', 'debian 11']
		}
	};
</script>

<main>
	<h1 class="mb-10">about</h1>

	<section class="mb-10">
		<p class="mt-2">
			i’m an undergraduate student studying physics, math, and computer science at u of t. i build
			good software and study cool stuff. currently learning about quantum computing and
			cybersecurity.

			<br />
			<br />

			i recently organized <a href="https://hack404.dev">hack404</a>, a hackathon at u of t, where i
			led a team of students to develop a web application for managing hacker accounts and projects.
		</p>
	</section>

	<section>
		<h2>languages</h2>
		<ul>
			{#each Object.entries(content.languages) as [category, items] (category)}
				<li>
					{category} →
					{#each items as item, i (item)}
						{item}
						{#if i < items.length - 1}
							<span class="split">/</span>&nbsp; <!-- adding non-breaking space -->
						{/if}
					{/each}
				</li>
			{/each}
		</ul>
	</section>
	<section>
		<h2>tech</h2>
		<ul>
			{#each Object.entries(content.tech) as [category, items] (category)}
				<li>
					{category} →
					{#each items as item, i (item)}
						{item}
						{#if i < items.length - 1}
							<span class="split">/</span>&nbsp; <!-- adding non-breaking space -->
						{/if}
					{/each}
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>this site</h2>
		<ul>
			<li>
				stack → sveltekit <span class="split">/</span> mdsvex
				<span class="split">/</span> vite <span class="split">/</span> github pages
			</li>
			<li>
				fonts →
				<span style="font-family: 'Overpass Mono'" class="tracking-normal">overpass mono </span>
				<span class="split">/</span>
				overpass
			</li>
		</ul>
		<div class="info">
			<div class="colors">
				<div class="color" style="background: var(--bg-1); border: 2px solid var(--bg-2);">bg</div>
				<div class="color" style="background: var(--bg-2);">bg-2</div>
				<div class="color" style="background: var(--fg-2); color: var(--bg-1)">fg-2</div>
				<div class="color" style="background: var(--fg-1); color: var(--bg-1)">fg-1</div>
				<div class="color" style="background: var(--accent-1); color: var(--bg-1)">a-1</div>
				<div class="color" style="background: var(--accent-2); color: var(--bg-1)">a-2</div>
			</div>
		</div>
	</section>
</main>

<style>
	.colors {
		display: inline-flex;
		margin-top: 0.4rem;
		flex-wrap: wrap;
	}

	.color {
		display: inline-block;
		width: 5rem;
		text-align: center;
		font-family: 'overpass mono', monospace;
		font-size: 1em;
		border: 2px solid rgba(0, 0, 0, 0);
	}
</style>
