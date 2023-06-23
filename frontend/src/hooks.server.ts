import type { Server } from '$lib/sharedTypes'
import { redirect, type Handle } from '@sveltejs/kit'
import { StatsD } from './util/statsd'
import { getPixelMap } from '$api/_redis'
import { publicEnv } from './publicEnv'
import type { HandleWs } from '@carlosv2/adapter-node-ws'
import { auth, shouldBeAuthenticated } from '$lib/server/auth'

let listenerCount = 0
let globalIo: Server | undefined = undefined
const statsd = new StatsD('pixels')

// This file is rather weird because of a hack in adapter-node-ws
// only allowing the handleWs function to have access to the socket.io server
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

// Injecting global variables into the event object
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	event.locals.statsd = statsd
	event.locals.auth = auth.handleRequest(event)
	if (!shouldBeAuthenticated(event)) {
		return resolve(event)
	}

	const { user } = await event.locals.auth.validateUser()
	if (!user) {
		throw redirect(302, '/auth/sign-in')
	}

	return resolve(event)
}
