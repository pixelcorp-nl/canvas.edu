<script lang="ts">
	export let code: string
	import Highlight from 'svelte-highlight'
	import python from 'svelte-highlight/languages/python'
	import CopyButton from '$components/CopyButton.svelte'
</script>

<div class="flex flex-col my-3">
	<div class="flex justify-between h-16 -my-1 items-center bg-gray-200 rounded-t-xl">
		<span class="font-semibold ml-2.5">Python</span>
		<CopyButton {code} />
	</div>
	<Highlight class="bg-[#0d1117] !m-0 transition-all duration-1000" language={python} {code} />
</div>
