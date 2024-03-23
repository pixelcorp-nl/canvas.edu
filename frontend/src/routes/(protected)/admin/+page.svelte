<script lang="ts">
	import Form from '$components/Form.svelte'
	import { onDestroy } from 'svelte'
	import type { PageData } from './$types'
	import { io } from 'socket.io-client'
	import type { Socket } from '$lib/sharedTypes'

	const socket: Socket = io()
	export let data: PageData
	export let form: { ok: false; error?: string } | { ok: true; value: string } | null

	let listenerCount = 0
	socket.on('listenerCount', count => (listenerCount = count))

	onDestroy(() => {
		socket.removeAllListeners()
		socket.disconnect()
	})
</script>

Users connected: {listenerCount}

<Form fields={data.settings} action="?/settings">
	{#if !form}
		<!-- -->
	{:else if !form.ok}
		<p class="text-red-700">{form.error || ''}</p>
	{:else}
		<p class="text-green-700">Settings updated!</p>
	{/if}
</Form>
