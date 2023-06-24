<script>
	import { PUBLIC_API_URL } from '$env/static/public';

	let name = '';
	let greetMsg = '';

	async function greet() {
		const res = await fetch(`${PUBLIC_API_URL}/api/v1`);
		const data = await res.json();
		console.log(data);

		greetMsg = `Hello, ${name}! ${data}`;
	}
</script>

<div>
	<input id="greet-input" placeholder="Enter a name..." bind:value={name} />
	<button on:click={greet}>Greet</button>
	<p>{greetMsg}</p>
</div>
