import type { Server } from '$lib/sharedTypes'
import { StatsD } from './util/statsd'
import type { Session } from './hooks.server'
// See https://kit.svelte.dev/docs/types#app

declare global {
	declare namespace App {
		interface Locals {
			io: Server
			statsd: StatsD
		}
	}
}

export {}
