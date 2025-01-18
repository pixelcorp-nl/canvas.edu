<script lang="ts">
	import Form from '$components/Form.svelte'
	import { hasRole } from '$lib/public/util'
	import type { PageData, ActionData } from './$types'
	import { onDestroy } from 'svelte'
	import { io } from 'socket.io-client'
	import type { Socket } from '$lib/sharedTypes'
	import copy from 'copy-to-clipboard'

	const socket: Socket = io()
	export let data: PageData
	export let form: ActionData

	let listenerCount = 0
	socket.on('listenerCount', count => (listenerCount = count))

	onDestroy(() => {
		socket.removeAllListeners()
		socket.disconnect()
	})
</script>

<article class="prose mx-auto">
	<!-- {#if hasRole(data.roles, 'stats')}
		<h2 class="text-l mb-0">Stats</h2>
		Users connected: {listenerCount}
		<br />
	{/if} -->

	{#if hasRole(data.roles, 'canvasSettings')}
		<h2 class="text-l mt-8 mb-0">Global settings</h2>

		<Form action={'?/setSettings'} fields={data.settings}>
			{#if !form || form.name !== 'setSettings'}
				<!-- -->
			{:else if !form.ok}
				<p class="text-red-700">{form.error}</p>
			{:else}
				<p class="text-green-700">Settings updated!</p>
			{/if}
		</Form>
	{/if}

	{#if hasRole(data.roles, 'classes:manage')}
		<h2 class="text-l mt-8 mb-0">Create class</h2>

		<Form action={'?/createClass'} fields={data.newClass} buttonText="Create">
			{#if !form || form.name !== 'createClass'}
				<!-- -->
			{:else if !form.ok}
				<p class="text-red-700">{form.error}</p>
			{:else}
				<p class="text-green-700">Class created</p>
			{/if}
		</Form>
	{/if}

	{#if data.classes}
		<h2 class="text-l mt-8 mb-0">Existing classes: {data.classes.length}</h2>
		<table id="classes">
			<tbody>
				<tr>
					<th>Name</th>
					<th>ID</th>
					<th>Max users</th>
					<th>n.o. Users</th>
					<th>Copy link</th>
					<th>Users</th>
				</tr>
				{#each data.classes as _class}
					<tr>
						<td>{_class.name}</td>
						<td id={`${_class.name}-id`}>{_class.id}</td>
						<td>{_class.maxUsers}</td>
						<td>{_class.users.length}</td>
						<td>
							<button class="underline cursor-pointer focus:no-underline" on:click={() => copy(`${window.location.origin}/signup?classId=${_class.id}`)}> Copy signup link </button>
						</td>
						<td class="max-w-[20rem] whitespace-normal">
							{#each _class.users as user}
								{user.name}{', '}
							{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	{#if data.users}
		<h2 class="text-l mt-8 mb-0">Existing users: {data.users.length}</h2>
		<table id="users">
			<tbody>
				<tr>
					<th>Id</th>
					<th>Username</th>
					<th>ApiKey</th>
				</tr>
				{#each data.users as user}
					<tr>
						<td>{user.id}</td>
						<td>{user.name}</td>
						<td>{user.key}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</article>

<style>
	th {
		white-space: nowrap;
		padding: 0 15px 0 0;
	}
	td {
		white-space: nowrap;
	}
</style>
