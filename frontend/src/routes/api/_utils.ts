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
