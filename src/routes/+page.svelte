<script lang="ts">
	import '../app.css';
</script>

<div class="flex justify-center">
	<div class="flex min-h-dvh w-4/5 flex-col justify-center overflow-hidden leading-normal">
		<h1 class="text-5xl">oliver huang</h1>
		<p class="mt-2">physics, mathematics, and computer science student.</p>
		<nav class="mt-1 flex gap-10">
			<a class="nav-item" href="/about">about</a>
			<a class="nav-item" href="/projects">projects</a>
			<a class="nav-item" href="/blog">blog</a>
			<a class="nav-item" href="/contact">contact</a>
		</nav>
	</div>
</div>

<style>
	.nav-item {
		display: flex;
		align-items: center;
		font-family: 'Newsreader', monospace;
		gap: 0.5rem;
		font-size: 1.2rem;
		text-decoration: none;
		position: relative;
		transition: transform 0.3s ease-in-out;
	}

	.nav-item::before {
		content: '→';
		position: absolute;
		left: 0;
		width: 100%;
		opacity: 0; /* Initially hidden */
		transition:
			opacity 0.3s ease-in-out,
			transform 0.3s ease-in-out;
	}

	.nav-item:hover {
		transform: translateX(15px);
	}

	.nav-item:hover::before {
		opacity: 1;
		transform: translateX(-15px); /* Move the arrow into position */
	}
</style>
