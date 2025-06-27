<script lang="ts">
	import { LinkedinLogo, Envelope, GithubLogo } from 'phosphor-svelte';

	let status = $state('submit ->');

	const handleSubmit = async (data: SubmitEvent) => {
		data.preventDefault();

		status = 'submitting...';
		const form = data.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const object = Object.fromEntries(formData);
		object.access_key = '8cdcaf12-0eab-417e-b881-4f00ef1c45d3';
		const json = JSON.stringify(object);

		const response = await fetch('https://api.web3forms.com/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: json
		});

		const result = await response.json();
		if (result.success) {
			status = 'message sent!';
		}
	};
</script>

<main>
	<h1 class="mb-10">contact</h1>

	<section class="mb-10">
		<p class="mt-2 leading-loose">feel free to reach out to me.</p>
	</section>

	<section class="mb-10">
		<h2>some links</h2>
		<ul>
			<li>
				<GithubLogo class="inline-block h-6 w-6" /> github ->
				<a href="https://github.com/osh3276">osh3276</a>
			</li>
			<li>
				<LinkedinLogo class="inline-block h-6 w-6" /> linkedin ->
				<a href="https://www.linkedin.com/in/oliver-huang-931947232/">oliver huang</a>
			</li>
			<!-- email -->
			<li>
				<Envelope class="inline-block h-6 w-6" /> email ->
				<a href="mailto:ohuang4131@gmail.com">osh3276@gmail.com</a>
			</li>
		</ul>
	</section>

	<section>
		<h2>contact form</h2>
		<!-- <form action="https://formspree.io/f/xrbparpp" method="POST" class="mt-4"> -->
		<form onsubmit={handleSubmit} class="mt-2">
			<input type="hidden" name="access_key" value="access-key" />
			<div class="mb-4">
				<label for="name" class="block text-lg font-medium tracking-wider">name</label>
				<input type="text" id="name" name="name" required />
			</div>

			<div class="mb-4">
				<label for="email" class="block text-lg font-medium tracking-wider">email</label>
				<input type="email" id="email" name="email" required />
			</div>

			<div class="mb-4">
				<label for="message" class="block text-lg font-medium tracking-wider">message</label>
				<textarea id="message" name="message" rows="5" required></textarea>
			</div>

			<div class="mb-4">
				<button type="submit" class="tracking-wider">{status}</button>
			</div>
		</form>
	</section>
</main>

<style>
	input {
		background-color: var(--bg-1);
		width: 100%;
		border: 2px solid var(--bg-2);
		padding: 0.5rem;
		letter-spacing: 0.05em;
		font-size: 1rem;
		transition: border 0.2s ease;
	}

	input:focus {
		box-shadow: none;
		border: 2px solid var(--accent-1);
	}

	textarea {
		background-color: var(--bg-1);
		width: 100%;
		border: 2px solid var(--bg-2);
		padding: 0.5rem;
		letter-spacing: 0.05em;
		font-size: 1rem;
		transition: border 0.2s ease;
	}

	textarea:focus {
		box-shadow: none;
		border: 2px solid var(--accent-1);
	}

	button {
		background-color: var(--bg-2);
		color: var(--fg-1);
		padding: 10px 20px;
		outline: 2px solid transparent;
		font-size: 1rem;
		border: none;
		cursor: pointer;
		transition: outline-color 0.2s ease;
	}

	button:hover {
		outline-color: var(--accent-2);
	}
</style>
