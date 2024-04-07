import { DB, type FullUser } from '$lib/server/db'
import { getPixelMap } from '$lib/server/redis'
import { User } from '$lib/server/schemas'
import type { Server } from '$lib/sharedTypes'
import Credentials from '@auth/core/providers/credentials'
import { SvelteKitAuth } from '@auth/sveltekit'
import type { HandleWs } from '@carlosv2/adapter-node-ws'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { StatsD } from './util/statsd'
import util from 'util'
import { setupDBSingleton } from './setupDB'

util.inspect.defaultOptions.depth = 10
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

	io.use((socket, next) => {
		const user = socket.handshake.auth['user']
		if (!user) {
			return next(new Error('Authentication error'))
		}
		socket.data.user = user
		next()
	})

	io.on('connection', async socket => {
		const user = socket.data.user as FullUser
		console.log('User connected:', user.name)
		socket.join(user.classId)

		listenerCount++
		statsd.gauge('connections', listenerCount)
		io.emit('listenerCount', listenerCount)
		socket.on('disconnect', () => {
			listenerCount--
			statsd.gauge('connections', listenerCount)
			io.emit('listenerCount', listenerCount)
		})

		const pixels = await getPixelMap(user.classId)
		socket.emit('pixelMap', pixels)
	})
}

export type Session = {
	user: FullUser
	expires: string
}

const credentials = Credentials({
	name: 'Credentials',
	credentials: {
		// TODO: better
		id: { label: 'id', type: 'text' },
		username: { label: 'username', type: 'text' },
		key: { label: 'key', type: 'text' }
	},
	async authorize(credentials) {
		const parsed = await User.safeParseAsync(credentials)
		if (!parsed.success) {
			console.log('Invalid credentials formatting', parsed.error)
			return null
		}

		const user = await DB.user.getBy('id', parsed.data.id)
		if (!user) {
			console.log('User not found')
			return null
		}
		return {
			id: user.id,
			name: user.name,
			key: user.key,
			classId: user.classId,
			class: user.class,
			roles: user.roles
		} satisfies FullUser
	}
})

const authHandle = SvelteKitAuth({
	providers: [credentials],
	pages: {
		// signIn: '/signup' // TODO: up or in
	},
	// Does it look like I care?
	secret: '126b402ae7264a6497882db7876ebdfa356fc8440bccfba7c742f0afbb4fd967',
	callbacks: {
		session({ session, token }) {
			const t = token as FullUser
			return {
				...session,
				user: t
			} satisfies Session
		},
		jwt({ token, user }) {
			return (user as FullUser) ?? token ?? null
		}
	},
	trustHost: true
})

// TODO protect paths

// Injecting global variables into the event object
const injectHandle: Handle = async ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	event.locals.statsd = statsd

	// make sure the database is setup
	await setupDBSingleton()
	return resolve(event)
}

const logHandle: Handle = ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/api')) {
		console.log(event.url.pathname + event.url.search, '|', event.route.id)
	}
	event.locals.statsd.increment('request')
	return resolve(event)
}

export const handle: Handle = sequence(injectHandle, logHandle, authHandle)

export const handleError: HandleServerError = a => {
	if (a.event.route.id) {
		console.error(a.error)
		return {
			status: 500,
			message: a.error instanceof Error ? a.error.message : String(a.error)
		}
	}
	const message = `404: page ${a.event.url.pathname} not found`
	console.log(message)
	return { message }
}
