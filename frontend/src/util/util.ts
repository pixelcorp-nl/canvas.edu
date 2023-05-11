import type { PixelMap } from "$lib/sharedTypes"

export function forEachPixel(pixels: PixelMap, callback: (x: number, y: number, rgba: string) => void): void {
	for (const [key, rgba] of Object.entries(pixels)) {
		const [x, y] = key.split(',').map(Number) as [number, number]
		callback(x, y, rgba)
	}
}
