import type { Server } from '$lib/sharedTypes'
import type { Handle } from '@sveltejs/kit'
import { StatsD } from './util/statsd'
import { getPixelMap } from '$api/_redis'
import { publicEnv } from './publicEnv'
import type { HandleWs } from '@carlosv2/adapter-node-ws'

let listenerCount = 0

// This file is rather weird because of a hack in adapter-node-ws
// only allowing the handleWs function to have access to the socket.io server

let globalIo: Server | undefined = undefined
export const handleWs: HandleWs = (io: Server) => {
	if (globalIo) {
		return
	}
	globalIo = io

	io.on('connection', async socket => {
		listenerCount++
		statsd.gauge('connections', listenerCount)
		socket.on('disconnect', () => {
			listenerCount--
			statsd.gauge('connections', listenerCount)
		})
		const pixels = await getPixelMap(publicEnv.canvasId)
		socket.emit('pixelMap', pixels)
	})
}

const statsd = new StatsD('pixels')

// Injecting global variables into the event object
export const handle: Handle = ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	event.locals.statsd = statsd
	return resolve(event)
}
