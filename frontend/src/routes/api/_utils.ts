import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH } from '$env/static/public'
import { z } from 'zod'

const canvasHeight = Number(PUBLIC_CANVAS_HEIGHT)
const canvasWidth = Number(PUBLIC_CANVAS_WIDTH)

const rgbValue = z.number().min(0).max(255)

export const ParsedPixel = z.object({
	x: z.number().min(0).max(canvasWidth),
	y: z.number().min(0).max(canvasHeight),
	color: z.array(rgbValue).length(4)
})
export type ParsedPixel = z.infer<typeof ParsedPixel>
