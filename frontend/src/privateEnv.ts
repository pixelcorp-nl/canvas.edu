import { dev } from '$app/environment'
import { PRIVATE_POSTGRES_URL, PRIVATE_REDIS_URL, PRIVATE_STATSD_HOST, PRIVATE_STATSD_PORT } from '$env/static/private'
import { z } from 'zod'

const PrivateEnv = z.object({
	redisUrl: z.string().url(),
	postgresUrl: z.string().url().endsWith('/postgres'),
	statsdHost: z.string().min(1),
	statsdPort: z.number().int().min(1).max(65535),
	userPasswords: z.boolean()
})
export type PrivateEnv = z.infer<typeof PrivateEnv>

export const privateEnv = {
	redisUrl: dev ? 'redis://localhost:6379' : PRIVATE_REDIS_URL,
	postgresUrl: dev ? 'postgres://postgres:postgres@localhost:5432/postgres' : PRIVATE_POSTGRES_URL,
	statsdHost: PRIVATE_STATSD_HOST,
	statsdPort: Number(PRIVATE_STATSD_PORT),
	userPasswords: false // wether we require a password to sign up
} as const satisfies PrivateEnv

PrivateEnv.parse(privateEnv)
