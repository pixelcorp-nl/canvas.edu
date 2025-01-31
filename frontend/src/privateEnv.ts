import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { z } from 'zod'

const { PRIVATE_POSTGRES_URL, PRIVATE_REDIS_URL, PRIVATE_STATSD_HOST, PRIVATE_STATSD_PORT, PRIVATE_ADMIN_KEY } = env
const PrivateEnv = z.strictObject({
	redisUrl: z.string().url(),
	postgresUrl: z.string().url().endsWith('/postgres'),
	statsdHost: z.string().min(1),
	statsdPort: z.number().int().min(1).max(65535),
	userPasswords: z.boolean(),
	adminKey: z.string().min(1)
})
export type PrivateEnv = z.infer<typeof PrivateEnv>

const defaultAdminKey = 'joppe' as const

export const privateEnv = {
	redisUrl: dev ? 'redis://127.0.0.1:16379' : PRIVATE_REDIS_URL,
	postgresUrl: dev ? 'postgres://postgres:postgres@localhost:5432/postgres' : PRIVATE_POSTGRES_URL,
	statsdHost: PRIVATE_STATSD_HOST,
	statsdPort: Number(PRIVATE_STATSD_PORT),
	userPasswords: false, // wether we require a password to sign up
	adminKey: PRIVATE_ADMIN_KEY || defaultAdminKey
} as const satisfies PrivateEnv

PrivateEnv.parse(privateEnv)
if (privateEnv.adminKey === defaultAdminKey) {
	console.warn('ADMIN KEY IS DEFAULT, PLEASE CHANGE IT')
}
