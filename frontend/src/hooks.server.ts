import { getPixelMap } from '$lib/server/redis'
import type { Server } from '$lib/sharedTypes'
import type { HandleWs } from '@carlosv2/adapter-node-ws'
import type { Handle } from '@sveltejs/kit'
import { publicEnv } from './publicEnv'
import { StatsD } from './util/statsd'
import { DB, pool } from '$lib/server/db'
import { SvelteKitAuth } from '@auth/sveltekit'
import Auth from '@auth/core'
import Credentials from '@auth/core/providers/credentials'
import { sequence } from '@sveltejs/kit/hooks'
import { z } from 'zod'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import GitHub from '@auth/core/providers/github'

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

const User = z.object({
	name: z.string().min(1),
	key: z.string().min(1)
})
type User = z.infer<typeof User>

const gh = GitHub({ clientId: 'e080da33865f31232b51', clientSecret: '4a8353fecf66a2a53e7fb13f1def12082b593599' })
const credentials = Credentials({
	name: 'Credentials',
	credentials: {
		username: { label: 'Username' }
		// key: { label: 'Key', type: 'text' }
	},
	async authorize(credentials, _) {
		// console.log(0, { credentials })
		const user = { id: '1', name: credentials.username, key: credentials.key }

		return user
		// const parse = await LoginUserSchema.safeParseAsync(credentials)
		// if (!parse.success) {
		// 	console.log('invalid credentials', parse.error)
		// 	return null
		// }
		// const user = await DB.user.getBy('name', parse.data.username)
		// if (!user) {
		// 	console.log('user not found')
		// 	return null
		// }
		// return user
	}
})

const authHandle = SvelteKitAuth({
	providers: [credentials],
	pages: {
		signIn: '/signup' // TODO: up or in
	},
	secret: '126b402ae7264a6497882db7876ebdfa356fc8440bccfba7c742f0afbb4fd967',
	callbacks: {
		session({ session, token, user }) {
			// console.log(1, { session, token, user })
			const u = {
				name: token.name as string,
				key: token['key'] as string
			} satisfies User

			const s = {
				...session,
				user: u
			}
			// console.log(2, { s })
			return s
		},
		jwt({ token, account, user }) {
			console.log(4, { token, account, user })
			if (account) {
				token['id'] = user.id
				token['name'] = user.name
				// @ts-expect-error
				token['key'] = user.key
			}
			return token
		}
	}
	// session: {
	// 	strategy: 'jwt'
	// }
	// trustHost: true
	// adapter: DrizzleAdapter(db)
})

// TODO protect paths

const otherHandle: Handle = ({ event, resolve }) => {
	event.locals.io = globalIo as Server
	event.locals.statsd = statsd

	// make sure the database is setup
	// TODO: enable
	// await setupDBSingleton()
	return resolve(event)
}
const logHandle: Handle = ({ event, resolve }) => {
	console.log(event.url.pathname + event.url.search, '|', event.route.id)
	return resolve(event)
}
// Injecting global variables into the event object
export const handle: Handle = sequence(logHandle, authHandle, otherHandle)
