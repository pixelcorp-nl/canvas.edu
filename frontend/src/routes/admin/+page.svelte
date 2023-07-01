<script lang="ts">
	import { enhance } from '$app/forms'
	import type { PageData } from './$types'

	export let data: PageData
	export let form: { ok: false; error?: string } | { ok: true }
</script>

<!-- TODO: update when value changes -->
<form method="post" use:enhance>
	{#each data.settings as setting}
		<label for={setting.key}>{setting.key}</label>
		<input name={setting.key} type={setting.type} value={setting.value} step="any" />
	{/each}
	<br />
	<button type="submit">Update</button>
	{#if form}
		{#if !form.ok}
			<p class="text-red-700">{form.error || ''}</p>
		{:else}
			<p class="text-green-700">Settings updated!</p>
		{/if}
	{/if}
</form>
