import type { Server } from '$lib/sharedTypes'
import type { Handle } from '@sveltejs/kit'
import { getPixelMap } from '$api/_redis'
import { publicEnv } from './publicEnv'
import { storeSocketData } from '$api/questdb/_index'

// This file is rather weird because of a hack in adapter-node-ws
// only allowing the handleWs function to have access to the socket.io server

async function getListeners(io: Server) {
	const listeners = await io.sockets.listeners('connection')
	return listeners.length
}

let globalIo: Server | undefined = undefined
export const handleWs = (io: Server) => {
	globalIo = io

	io.on('connection', async socket => {
		await storeSocketData(publicEnv.canvasId, socket.id, 'connection', socket.handshake.address, 'socket', await getListeners(io))
		// console.log(io.listenerCount('connection'))
		socket.on('disconnect', () => {
			storeSocketData(publicEnv.canvasId, socket.id, 'disconnect', socket.handshake.address, 'socket', null)
		})
		const pixels = await getPixelMap(publicEnv.canvasId)
		socket.emit('pixelMap', pixels)
	})
}

// Injecting global variables into the event object
export const handle: Handle = ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	return resolve(event)
}
