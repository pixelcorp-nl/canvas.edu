import type { Coordinate, PixelMap, RGBA } from '$lib/sharedTypes'
import { publicEnv } from '../../publicEnv'
import { z } from 'zod'
const { canvasHeight, canvasWidth } = publicEnv

const rgbValue = z.number().min(0).max(255)

const pixelObj = {
	x: z
		.number({
			invalid_type_error: 'x must be a number',
			required_error: 'x is required'
		})
		.min(0, 'x must be greater than or equal to 0')
		.max(canvasWidth, `x must be less than or equal to ${canvasWidth}`),
	y: z
		.number({
			invalid_type_error: 'y must be a number',
			required_error: 'y is required'
		})
		.min(0, 'y must be greater than or equal to 0')
		.max(canvasHeight, `y must be less than or equal to ${canvasHeight}`),
	color: z
		.array(rgbValue, {
			invalid_type_error: 'color must be an array of numbers',
			required_error: 'color is required'
		})
		.length(3)
}

export const PixelObj = z.strictObject(pixelObj)
export type PixelObj = z.infer<typeof PixelObj>

// Because this is a user send object, we want to be a bit less strict in parsing
// so we use z.object instead of z.strictObject
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
