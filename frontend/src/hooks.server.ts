import type { Server } from '$lib/sharedTypes'
import type { Handle } from '@sveltejs/kit'
import { getPixelMap } from '$api/_redis'
import { publicEnv } from './publicEnv'
import { storeSocketData } from '$api/questdb/_index'

// This file is rather weird because of a hack in adapter-node-ws
// only allowing the handleWs function to have access to the socket.io server

let globalIo: Server | undefined = undefined
export const handleWs = (io: Server) => {
	globalIo = io

	io.on('connection', async socket => {
		storeSocketData(publicEnv.canvasId, socket.id, 'connection', socket.handshake.address, 'socket')
		socket.on('disconnect', () => {
			storeSocketData(publicEnv.canvasId, socket.id, 'disconnect', socket.handshake.address, 'socket')
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
