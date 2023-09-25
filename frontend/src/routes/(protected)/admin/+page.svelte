<script lang="ts">
	import Form from '$components/Form.svelte'
	import { hasRole } from '$lib/public/util'
	import type { PageData, ActionData } from './$types'

	export let data: PageData
	export let form: ActionData
</script>

<article class="prose mx-auto">
	{#if hasRole(data.roles, 'canvasSettings')}
		<h2 class="text-l">Global settings</h2>
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
		<h2 class="text-l">Create class</h2>
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
		<h2 class="text-l">Existing classes - {data.classes.length}</h2>
		<p />
		<table id="classes">
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
					<td id={`${_class.name}-id`}>{_class.id}</td>
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

	{#if data.users}
		<h2 class="text-l">Existing users - {data.users.length}</h2>
		<p />
		<table id="users">
			<tr>
				<th>Id</th>
				<th>Username</th>
				<th>ApiKey</th>
			</tr>
			{#each data.users as user}
				<tr>
					<td>{user.id}</td>
					<td>{user.username}</td>
					<td>{user.apikey}</td>
				</tr>
			{/each}
		</table>
	{/if}
</article>
