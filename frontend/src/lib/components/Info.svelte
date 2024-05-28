<script lang="ts">
	import { Info } from 'lucide-svelte'
	export let content: string
</script>

<div class="bg-blue-100 p-2 rounded-lg flex hover:shadow-sm transition-all">
	<div class="flex items-center">
		<Info class="w-8 h-8 stroke-blue-500" />
	</div>
	<span class="bg-blue text-blue-500 font-semibold my-auto ml-1.5">Info:</span>
	<span class="my-auto mx-2 bg-white/50 p-2 rounded-md w-full">
		{content}
	</span>
</div>

<!-- <p class="bg-blue-100 p-2 rounded-lg">
	<span class="bg-blue text-blue-500 font-semibold">ℹ️ Info:</span><br />
	{content}
</p> -->
