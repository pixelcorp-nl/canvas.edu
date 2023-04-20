import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH } from '$env/static/public'

const canvasHeight = Number(PUBLIC_CANVAS_HEIGHT)
const canvasWidth = Number(PUBLIC_CANVAS_WIDTH)

export function isValidRequest(x: number, y: number, color: number[]): boolean {
	if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight || !color) {
		return false
	}
	if (color.length !== 4) {
		return false
	}
	if (color.some((c: number) => c < 0 || c > 255)) {
		return false
	}
	if (color.some((c: number) => isNaN(c))) {
		return false
	}
	return true
}
