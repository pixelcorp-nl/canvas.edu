import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH } from '$env/static/public'
import { z } from 'zod'

const PublicEnv = z.strictObject({
	canvasHeight: z.number().min(1),
	canvasWidth: z.number().min(1)
})
export type PublicEnv = z.infer<typeof PublicEnv>

export const publicEnv = {
	canvasHeight: Number(PUBLIC_CANVAS_HEIGHT),
	canvasWidth: Number(PUBLIC_CANVAS_WIDTH)
} as const satisfies PublicEnv

// Non square canvases are not supported (yet)
if (publicEnv.canvasWidth !== publicEnv.canvasHeight) {
	throw new Error('canvasWidth and canvasHeight must be equal')
}

PublicEnv.parse(publicEnv)
