import { PRIVATE_REDIS_URL, PRIVATE_STATSD_HOST, PRIVATE_STATSD_PORT } from '$env/static/private'
import { z } from 'zod'

const PrivateEnv = z.object({
	redisUrl: z.string().url(),
	statsdHost: z.string().min(1),
	statsdPort: z.number().int().min(1).max(65535)
})
export type PrivateEnv = z.infer<typeof PrivateEnv>

export const privateEnv = {
	redisUrl: PRIVATE_REDIS_URL,
	statsdHost: PRIVATE_STATSD_HOST,
	statsdPort: Number(PRIVATE_STATSD_PORT)
} as const satisfies PrivateEnv

PrivateEnv.parse(privateEnv)
