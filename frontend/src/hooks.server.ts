import { getPixelMap } from '$lib/server/redis'
import { auth } from '$lib/server/auth'
import type { Server } from '$lib/sharedTypes'
import type { HandleWs } from '@carlosv2/adapter-node-ws'
import type { Handle } from '@sveltejs/kit'
import { publicEnv } from './publicEnv'
import { StatsD } from './util/statsd'
import { pool } from '$lib/server/db'
import { schema } from './setupDB'
import util from 'util'
util.inspect.defaultOptions.depth = 10

let listenerCount = 0
let globalIo: Server | undefined = undefined
const statsd = new StatsD('pixels')

let dbIsSetup = false
async function setupDBSingleton() {
	if (dbIsSetup) {
		return
	}
	dbIsSetup = true
	await new Promise<void>(resolve => {
		pool.query(schema, err => {
			if (err) {
				console.error('Unrecoverable error while setting up DB:')
				throw err
			}
			resolve()
		})
	})
}

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

	// make sure the database is setup
	await setupDBSingleton()

	return resolve(event)
}
