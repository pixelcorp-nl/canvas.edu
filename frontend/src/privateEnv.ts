import { PRIVATE_REDIS_URL } from '$env/static/private'
import { z } from 'zod'

const PrivateEnv = z.object({
	redisUrl: z.string().url()
})
export type PrivateEnv = z.infer<typeof PrivateEnv>

export const privateEnv = {
	redisUrl: PRIVATE_REDIS_URL
} as const satisfies PrivateEnv

PrivateEnv.parse(privateEnv)
