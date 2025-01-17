import Redis from 'ioredis'
import { privateEnv } from '../../privateEnv'
import type { PixelMap } from '$lib/sharedTypes'
import { building } from '$app/environment'

export const r = building ? (0 as unknown as Redis) : new Redis(privateEnv.redisUrl)

export async function setPixelMap(canvasId: string, pixelMap: PixelMap): Promise<void> {
	await r.hmset(canvasId, pixelMap)
}

export async function getPixelMap(canvasId: string): Promise<PixelMap> {
	return (await r.hgetall(canvasId)) as PixelMap
}

export function getAllPixelMapIds(): Promise<string[]> {
	return r.keys('*')
}
