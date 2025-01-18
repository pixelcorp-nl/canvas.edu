<script lang="ts">
	import { _ } from 'svelte-i18n'
	import copy from 'copy-to-clipboard'
	export let code: string
	let active = false
	function handleCopy(code: string) {
		copy(code)
		active = true
		setTimeout(function () {
			active = false
		}, 2000)
	}
</script>

{#if active}
	<button class="bg-white hover:scale-[105%] transition-all py-0.5 border border-black rounded-md mr-2.5 px-2" on:click={() => handleCopy(code)}
		><span aria-hidden="true" role="img" class="text-sm mr-1.5">📋</span><span class="text-xs font-medium">{$_('copy.success')}</span></button>
{:else}
	<button class="bg-white hover:scale-[105%] transition-all py-0.5 border border-black rounded-md mr-2.5 px-2" on:click={() => handleCopy(code)}
		><span aria-hidden="true" role="img" class="text-sm mr-1.5">📋</span><span class="text-xs font-medium">{$_('copy')}</span></button>
{/if}
