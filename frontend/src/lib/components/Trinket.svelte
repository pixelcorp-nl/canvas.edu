<script lang="ts">
	import { SquareArrowOutUpRight } from 'lucide-svelte'
	export let content: string

	function handle_redirect() {
		window.open('https://trinket.io/embed/python3', '_blank')
	}
</script>

<div class="bg-gray-100 p-2 h-16 rounded-lg flex justify-evenly items-center space-x-4">
	<div class="w-1/4 flex-shrink-0">
		<img alt="trinket logo" src="/trinket-logo.png" class="w-full" />
	</div>
	<p class="p-2 my-auto rounded-md flex-1 text-center underline underline-offset-4 decoration-yellow-500 decoration-wavy">
		{content}
	</p>
	<button on:click={() => handle_redirect()} class="bg-yellow-500 animate-pulse hover:animate-none hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md flex items-center">
		Open
		<SquareArrowOutUpRight class="ml-1 w-4 h-4 stroke-white" />
	</button>
</div>
