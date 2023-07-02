import type { Coordinate, PixelMap, RGBA } from '$lib/sharedTypes'
import { publicEnv } from '../../publicEnv'
import { z } from 'zod'
const { canvasHeight, canvasWidth } = publicEnv

const rgbValue = z.number().min(0).max(255)

const pixelObj = {
	x: z.number().min(0).max(canvasWidth),
	y: z.number().min(0).max(canvasHeight),
	color: z.array(rgbValue).length(3)
}

export const PixelObj = z.object(pixelObj)
export type PixelObj = z.infer<typeof PixelObj>

export const PixelRequest = z.object({
	...pixelObj,
	key: z.string()
})
export type PixelRequest = z.infer<typeof PixelRequest>

export type PixelKV = [Coordinate, RGBA]
export function pixelObjToPixelKV(pixelObj: PixelObj): PixelKV {
	const { x, y, color } = pixelObj
	const rgba = `${color[0]},${color[1]},${color[2]}`
	return [`${x},${y}` as Coordinate, rgba as RGBA]
}

export function pixelKVToPixelObj(pixelKV: PixelKV): PixelObj {
	const [coordinate, rgba] = pixelKV
	const [x, y] = coordinate.split(',').map(Number) as [number, number]
	const color = rgba.split(',').map(Number) as [number, number, number]
	return { x, y, color }
}

export function forEachPixel(pixels: PixelMap, callback: (pixelObj: PixelObj) => void): void {
	for (const kv of Object.entries(pixels)) {
		callback(pixelKVToPixelObj(kv as PixelKV))
	}
}
