import Redis from 'ioredis'
import { privateEnv } from '../../privateEnv'
import type { PixelMap } from '$lib/sharedTypes'
import { storePixels } from './questdb/_index'

export const r = new Redis(privateEnv.redisUrl)

export async function setPixelMap(canvasId: string, pixelMap: PixelMap): Promise<void> {
	await storePixels(pixelMap, canvasId)
	await r.hmset(canvasId, pixelMap)
}

export async function getPixelMap(canvasId: string): Promise<PixelMap> {
	return (await r.hgetall(canvasId)) as PixelMap
}
