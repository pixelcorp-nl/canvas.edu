<script lang="ts">
	import Form from '$components/Form.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	export let form: { ok: false; error?: string } | { ok: true; value: string } | null
</script>

<Form fields={data.settings} />

{#if !form}
	<!-- -->
{:else if !form.ok}
	<p class="text-red-700">{form.error || ''}</p>
{:else}
	<p class="text-green-700">Settings updated!</p>
{/if}
