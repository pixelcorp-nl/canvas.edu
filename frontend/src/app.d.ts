import type { Server } from '$lib/sharedTypes'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			io: Server
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
