import lucia from 'lucia-auth'
import { sveltekit } from 'lucia-auth/middleware'
import { dev } from '$app/environment'
import { pg } from '@lucia-auth/adapter-postgresql'
import postgres from 'pg'

const pool = new postgres.Pool({
	connectionString: 'postgres://postgres:postgres@localhost:5432/postgres'
})

export const auth = lucia({
	adapter: pg(pool),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit()
})

export type Auth = typeof auth
