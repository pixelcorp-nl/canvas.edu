<script lang="ts">
	import Canvas from '$components/Canvas.svelte'
	import { io } from 'socket.io-client'

	const socket = io()
	socket.emit('clientToServer', 'message from client to server')
	socket.on('serverToClient', data => {
		console.log('serverToClient:', data)
	})
</script>

<Canvas />
