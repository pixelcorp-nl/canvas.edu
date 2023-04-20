import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH } from '$env/static/public'

const canvasHeight = Number(PUBLIC_CANVAS_HEIGHT)
const canvasWidth = Number(PUBLIC_CANVAS_WIDTH)

export function requestValidity(x: number, y: number, color: Array<number>): boolean {
	if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight || !color) {
		return false
	} else if (color.length !== 4) {
		return false
	} else if (color.some((c: number) => c < 0 || c > 255)) {
		return false
	} else if (color.some((c: number) => isNaN(c))) {
		return false
	} else if (typeof x !== 'number' || typeof y !== 'number') {
		return false
	}
	return true
}
