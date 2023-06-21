import type { PixelMap } from '$lib/sharedTypes'
import { publicEnv } from '../../publicEnv'
import { z } from 'zod'
const { canvasHeight, canvasWidth } = publicEnv

const rgbValue = z.number().min(0).max(255)

export const ParsedPixel = z.object({
	x: z.number().min(0).max(canvasWidth),
	y: z.number().min(0).max(canvasHeight),
	color: z.array(rgbValue).length(4)
})
export type ParsedPixel = z.infer<typeof ParsedPixel>

export function forEachPixel(pixels: PixelMap, callback: (x: number, y: number, rgba: string) => void): void {
	for (const [key, rgba] of Object.entries(pixels)) {
		const [x, y] = key.split(',').map(Number) as [number, number]
		callback(x, y, rgba)
	}
}
