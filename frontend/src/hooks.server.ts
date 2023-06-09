import { getPixelMap } from '$lib/server/redis'
import { auth, pool } from '$lib/server/auth'
import type { Server } from '$lib/sharedTypes'
import type { HandleWs } from '@carlosv2/adapter-node-ws'
import type { Handle } from '@sveltejs/kit'
import { publicEnv } from './publicEnv'
import { StatsD } from './util/statsd'

let listenerCount = 0
let globalIo: Server | undefined = undefined
const statsd = new StatsD('pixels')

function setupDB() {
	const schema = `
CREATE TABLE IF NOT EXISTS auth_user (id TEXT PRIMARY KEY, username TEXT, apikey TEXT);
CREATE TABLE IF NOT EXISTS auth_key (id TEXT PRIMARY KEY, user_id TEXT REFERENCES auth_user(id) NOT NULL, primary_key BOOLEAN NOT NULL, hashed_password TEXT, expires BIGINT);
CREATE TABLE IF NOT EXISTS auth_session (id TEXT PRIMARY KEY, user_id TEXT REFERENCES auth_user(id) NOT NULL, active_expires BIGINT NOT NULL, idle_expires BIGINT NOT NULL);
`
	pool.query(schema, err => {
		if (err) {
			throw err
		}
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

	// since this call only happens once, it's fine to do it here
	// maybe it's a weird place, but it does work
	setupDB()
}

// Injecting global variables into the event object
export const handle: Handle = ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	event.locals.statsd = statsd
	event.locals.auth = auth.handleRequest(event)

	return resolve(event)
}
