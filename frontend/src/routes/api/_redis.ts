import Redis from 'ioredis'
import { privateEnv } from '../../privateEnv'
import type { PixelMap } from '$lib/sharedTypes'

export const r = new Redis(privateEnv.redisUrl)

export async function setPixelMap(canvasId: string, pixelMap: PixelMap): Promise<void> {
	await r.hmset(canvasId, pixelMap)
}

export async function getPixelMap(canvasId: string): Promise<PixelMap> {
	return (await r.hgetall(canvasId)) as PixelMap
}

export function forEachPixel(pixels: PixelMap, callback: (x: number, y: number, rgba: string) => void): void {
	for (const [key, rgba] of Object.entries(pixels)) {
		const [x, y] = key.split(',').map(Number) as [number, number]
		callback(x, y, rgba)
	}
}
