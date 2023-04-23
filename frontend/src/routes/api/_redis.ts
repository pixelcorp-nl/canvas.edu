import Redis from 'ioredis'
import { env } from '$env/dynamic/private'

export const r = new Redis(env.PRIVATE_REDIS_URL)
