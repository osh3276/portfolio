<script lang="ts">
	import '@/app.css';
	import 'prismjs/themes/prism-tomorrow.css';
	import { LinkedinLogo, GithubLogo, Rss } from 'phosphor-svelte';

	let { children } = $props();
</script>

<header>
	<a href="/" class="title-link"><span class="title">oliver huang</span></a>
	<nav>
		<a href="/about" class="nav-item">about</a>
		<a href="/projects" class="nav-item">projects</a>
		<a href="/blog" class="nav-item">blog</a>
		<a href="/contact" class="nav-item">contact</a>
	</nav>
</header>

{@render children()}

<footer>
	<div class="footer-content">
		<div class="footer-links">
			<a
				href="https://www.linkedin.com/in/oliver-huang-931947232/"
				target="_blank"
				rel="noopener noreferrer"
				class="footer-link"
			>
				<LinkedinLogo class="inline-block h-5 w-5" />
				linkedin
			</a>
			<a
				href="https://github.com/osh3276"
				target="_blank"
				rel="noopener noreferrer"
				class="footer-link"
			>
				<GithubLogo class="inline-block h-5 w-5" />
				github
			</a>
			<!-- <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="footer-link">
				<Rss class="inline-block h-5 w-5" />
				rss
			</a> -->
		</div>
	</div>
</footer>

<style>
	header {
		background-color: var(--bg-1);
		color: var(--fg-1);
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'Spectral', monospace;
		transition: background-color 0.3s ease;
	}

	.title-link {
		text-decoration: none;
		color: inherit;
	}

	nav {
		display: flex;
		gap: 2.5rem;
		margin-right: 1.5rem;
	}

	.nav-item {
		text-decoration: none;
		color: var(--fg-1);
		font-size: 1.2rem;
		position: relative;
		transition: transform 0.3s ease-in-out;
	}

	.nav-item::before {
		content: '→';
		position: absolute;
		left: 0;
		width: 100%;
		opacity: 0;
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

	.title {
		position: relative;
		display: inline-block;
		font-size: 2rem;
		text-decoration: underline transparent;
		transition: text-decoration 0.2s ease-in-out;
	}

	.title:hover {
		cursor: pointer;
		text-decoration: underline currentColor;
	}

	footer {
		background-color: var(--bg-1);
		color: var(--fg-1);
		padding: 2rem 1rem;
		margin-top: 3rem;
		border-top: 1px solid var(--bg-2);
		font-family: 'overpass mono', monospace;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
	}

	.footer-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.footer-link {
		text-decoration: none;
		color: var(--fg-1);
		font-size: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.3s ease;
	}

	.footer-link:hover {
		color: var(--accent-1);
	}

	@media (max-width: 768px) {
		.title-link {
			display: none;
		}

		header {
			justify-content: center;
		}

		.footer-links {
			gap: 1rem;
			flex-wrap: wrap;
			justify-content: center;
		}

		.footer-link {
			font-size: 0.9rem;
		}
	}
</style>
