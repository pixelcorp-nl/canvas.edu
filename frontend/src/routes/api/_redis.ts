import Redis from 'ioredis'
import { privateEnv } from '../../privateEnv'

export const r = new Redis(privateEnv.redisUrl)
