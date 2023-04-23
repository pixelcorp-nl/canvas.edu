import type { Server } from 'socket.io'
import type { Handle } from '@sveltejs/kit'

// This file is rather weird because of a hack in adapter-node-ws
// only allowing the handleWs function to have access to the socket.io server

let globalIo: Server | undefined = undefined
export const handleWs = (io: Server) => {
	globalIo = io
}

// Injecting the socket.io server into the event object
export const handle: Handle = ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	return resolve(event)
}
