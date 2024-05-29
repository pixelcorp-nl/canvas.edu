<script lang="ts">
	import { Info } from 'lucide-svelte'
	import { _ } from 'svelte-i18n'
	export let content: string
</script>

<div class="bg-blue-100 p-2 rounded-lg flex flex-col my-2">
	<div class="flex items-center">
		<Info class="w-6 h-6 stroke-blue-500 fill-white/50" />
		<span class="bg-blue text-blue-500 font-semibold text-base my-auto ml-1.5">{$_('tip.header')}</span>
	</div>
	<span class="bg-white/50 p-2 m-0 mt-1 rounded-md">
		{content}
	</span>
</div>
