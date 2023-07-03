<script lang="ts">
	import { enhance } from '$app/forms'
	import type { PageData } from './$types'

	export let data: PageData
	export let form: { ok: false; error?: string } | { ok: true; value: string } | null
	let valueChanged = false
</script>

<form
	method="post"
	use:enhance={() =>
		({ update }) =>
			update({ reset: false })}>
	{#each data.settings as setting}
		<label for={setting.key}>{setting.key}</label>
		<input name={setting.key} type={setting.type} value={setting.value} step="any" on:input={() => (valueChanged = true)} />
	{/each}
	<br />
	<button type="submit" disabled={!valueChanged}>Update</button>
	{#if !form}
		<!-- -->
	{:else if !form.ok}
		<p class="text-red-700">{form.error || ''}</p>
	{:else}
		<p class="text-green-700">Settings updated!</p>
	{/if}
</form>

<style>
	form::placeholder {
		color: #ccc;
	}
	button:disabled {
		opacity: 0.5;
	}
</style>
