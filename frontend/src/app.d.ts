import type { Server } from '$lib/sharedTypes'
import { StatsD } from './util/statsd'
import type { AuthRequest } from 'lucia'
// See https://kit.svelte.dev/docs/types#app

declare global {
	namespace App {
		interface Locals {
			io: Server
			statsd: StatsD
			auth: AuthRequest
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/auth').Auth
		type UserAttributes = object
	}
}
export {}
