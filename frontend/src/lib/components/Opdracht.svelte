<script lang="ts">
	import { Sparkle } from 'lucide-svelte'
	import { _ } from 'svelte-i18n'

	export let content: string
</script>

<div class="bg-yellow-100 p-2 rounded-lg flex flex-col my-2">
	<div class="flex items-center">
		<Sparkle class="w-6 h-6 stroke-yellow-500 fill-white" />
		<span class="bg-yellow text-yellow-500 font-semibold text-base my-auto ml-1.5">{$_('assignment.header')}</span>
	</div>
	<span class="bg-white/50 p-2 mt-1 rounded-md">
		{content}
	</span>
</div>
