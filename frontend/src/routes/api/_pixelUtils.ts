import type { Coordinate, PixelMap, RGB } from '$lib/sharedTypes'
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

// contains the minimum required fields for a pixel object
export const PixelBase = z.strictObject(pixelObj)
export type PixelBase = z.infer<typeof PixelBase>

// Because this is a user send object, we want to be a bit less strict in parsing
// so we use z.object instead of z.strictObject
export const PixelRequest = z.object({
	...pixelObj,
	key: z.string()
})
export type PixelRequest = z.infer<typeof PixelRequest>

export type Pixel = PixelBase & { classId: string }

export type PixelKV = [Coordinate, RGB]
export function pixelObjToPixelKV(pixelObj: PixelBase): PixelKV {
	const { x, y, color } = pixelObj
	return [`${x},${y}`, `${color[0] as number},${color[1] as number},${color[2] as number}`]
}

export function pixelKVToPixelObj(pixelKV: PixelKV): PixelBase {
	const [coordinate, rgba] = pixelKV
	const [x, y] = coordinate.split(',')
	const color = rgba.split(',').map(Number) as [number, number, number]
	return { x: Number(x), y: Number(y), color }
}

export function forEachPixel(pixels: PixelMap, callback: (pixelObj: PixelBase) => void): void {
	for (const kv of Object.entries(pixels)) {
		callback(pixelKVToPixelObj(kv as PixelKV))
	}
}
