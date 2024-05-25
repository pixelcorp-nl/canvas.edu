<script lang="ts">
	import Form from '$components/Form.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	export let form: { ok: false; error?: string } | { ok: true; informationPage: string } | null
</script>

<br />
<div class="flex flex-row">
	<div class="basis-1/2 border-2 p-4 m-2">
		<Form fields={data.settings} action="?/settings">
			{#if !form}
				<!-- -->
			{:else if !form.ok}
				<p class="text-red-700">{form.error || ''}</p>
			{:else}
				<p class="text-green-700">Settings updated!</p>
			{/if}
		</Form>
	</div>
	<div class="basis-1/2 border-2 p-4 m-2 all-inital revert-tailwind">
		{#if form?.ok}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html form.informationPage}
		{/if}
	</div>
</div>

<style>
	.h1 {
		font-size: 4rem;
	}
</style>
