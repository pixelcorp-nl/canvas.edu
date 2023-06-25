import type { Server } from '$lib/sharedTypes'
import { StatsD } from './util/statsd'
// See https://kit.svelte.dev/docs/types#app

declare global {
	declare namespace Lucia {
		type Auth = import('$lib/server/auth').Auth
		type UserAttributes = {
			username: string
			apikey: string
		}
	}

	declare namespace App {
		interface Locals {
			io: Server
			statsd: StatsD
			auth: import('lucia-auth').AuthRequest
		}
	}
}

export {}
