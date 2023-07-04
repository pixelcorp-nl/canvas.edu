import lucia from 'lucia-auth'
import { sveltekit } from 'lucia-auth/middleware'
import { dev } from '$app/environment'
import { pg } from '@lucia-auth/adapter-postgresql'
import { pool } from './db'

export const auth = lucia({
	adapter: pg(pool),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: u => u
})

export type Auth = typeof auth
