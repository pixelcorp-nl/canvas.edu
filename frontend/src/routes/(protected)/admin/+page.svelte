<script lang="ts">
	import Form from '$components/Form.svelte'
	import type { PageData, ActionData } from './$types'

	export let data: PageData

	export let form: ActionData
</script>

<article class="text-column prose lg:prose-lg mx-auto mb-5 mt-10">
	<h1 class="text-xl">Settings for class</h1>

	<p>
		<Form action={'?/setSettings'} fields={data.settings}>
			{#if !form || form.name !== 'setSettings'}
				<!-- -->
			{:else if !form.ok}
				<p class="text-red-700">{form.error}</p>
			{:else}
				<p class="text-green-700">Settings updated!</p>
			{/if}
		</Form>
	</p>

	{#if data.classes}
		<h1 class="text-xl">Create class</h1>
		<p>
			<Form fields={data.newClass} action={'?/createClass'}>
				{#if !form || form.name !== 'createClass'}
					<!-- -->
				{:else if !form.ok}
					<p class="text-red-700">{form.error}</p>
				{:else}
					<p class="text-green-700">Class created</p>
				{/if}
			</Form>
		</p>
		<table>
			{#each data.classes as _class}
				<tr>
					{_class.name}
					{' '}
					{_class.key}
					{' '}
					{_class.maxUsers}
				</tr>
			{/each}
		</table>
	{/if}
</article>
