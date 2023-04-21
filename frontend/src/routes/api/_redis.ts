import { Redis } from '@upstash/redis'
import { env } from '$env/dynamic/private'

export const r = new Redis({
	url: env.PRIVATE_REDIS_URL,
	token: env.PRIVATE_REDIS_TOKEN
})
