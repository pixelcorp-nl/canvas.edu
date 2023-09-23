<script lang="ts">
	import Form from '$components/Form.svelte'
	import { hasRole } from '$lib/public/util'
	import type { PageData, ActionData } from './$types'

	export let data: PageData
	export let form: ActionData
</script>

<article class="text-column prose lg:prose-lg mx-auto mb-5 mt-10">
	{#if hasRole(data.roles, 'canvasSettings')}
		<h1 class="text-xl">Global settings</h1>
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
	{/if}

	{#if hasRole(data.roles, 'classes:manage')}
		<h1 class="text-xl">Create class</h1>
		<p>
			<Form action={'?/createClass'} fields={data.newClass} buttonText="Create">
				{#if !form || form.name !== 'createClass'}
					<!-- -->
				{:else if !form.ok}
					<p class="text-red-700">{form.error}</p>
				{:else}
					<p class="text-green-700">Class created</p>
				{/if}
			</Form>
		</p>
	{/if}

	{#if data.classes}
		<h1 class="text-xl">Existing classes</h1>
		<p />
		<table>
			<tr>
				<th>Name</th>
				<th>ID</th>
				<th>Max users</th>
				<th>n.o. Users</th>
				<th>Users</th>
			</tr>
			{#each data.classes as _class}
				<tr>
					<td>{_class.name}</td>
					<td>{_class.id}</td>
					<td>{_class.maxUsers}</td>
					<td>{_class.users.length}</td>
					<td>
						{#each _class.users as user}
							{user.username} {','}
						{/each}
					</td>
				</tr>
			{/each}
		</table>
	{/if}
</article>
