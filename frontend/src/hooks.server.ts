import type { Server } from '$lib/sharedTypes'
import type { Handle } from '@sveltejs/kit'
import { StatsD } from './util/statsd'

// This file is rather weird because of a hack in adapter-node-ws
// only allowing the handleWs function to have access to the socket.io server

let globalIo: Server | undefined = undefined
export const handleWs = (io: Server) => {
	globalIo = io
}

// Injecting the socket.io server into the event object
export const handle: Handle = ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	event.locals.statsd = new StatsD('pixels')
	return resolve(event)
}
