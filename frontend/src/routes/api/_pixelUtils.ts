import type { Coordinate, PixelMap, RGBA } from '$lib/sharedTypes'
import { publicEnv } from '../../publicEnv'
import { z } from 'zod'
const { canvasHeight, canvasWidth } = publicEnv

const rgbValue = z.number().min(0).max(255)

export const PixelObj = z.object({
	x: z.number().min(0).max(canvasWidth),
	y: z.number().min(0).max(canvasHeight),
	color: z.array(rgbValue).length(4)
})
export type PixelObj = z.infer<typeof PixelObj>

export type PixelKV = [Coordinate, RGBA]
export function pixelObjToPixelKV(pixelObj: PixelObj): PixelKV {
	const { x, y, color } = pixelObj
	const rgba = `${color[0]},${color[1]},${color[2]},${color[3]}`
	return [`${x},${y}` as Coordinate, rgba as RGBA]
}

export function pixelKVToPixelObj(pixelKV: PixelKV): PixelObj {
	const [coordinate, rgba] = pixelKV
	const [x, y] = coordinate.split(',').map(Number) as [number, number]
	const color = rgba.split(',').map(Number) as [number, number, number, number]
	return { x, y, color }
}

export function forEachPixel(pixels: PixelMap, callback: (pixelObj: PixelObj) => void): void {
	for (const kv of Object.entries(pixels)) {
		callback(pixelKVToPixelObj(kv as PixelKV))
	}
}
