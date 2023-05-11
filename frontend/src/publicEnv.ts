import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH, PUBLIC_SCALAR, PUBLIC_CANVAS_ID } from '$env/static/public'
import { z } from 'zod'

const PublicEnv = z.object({
	canvasHeight: z.number().min(1),
	canvasWidth: z.number().min(1),
	pScalar: z.number().min(1),
	canvasId: z.string().min(1)
})
export type PublicEnv = z.infer<typeof PublicEnv>

export const publicEnv = {
	canvasHeight: Number(PUBLIC_CANVAS_HEIGHT),
	canvasWidth: Number(PUBLIC_CANVAS_WIDTH),
	pScalar: Number(PUBLIC_SCALAR),
	canvasId: PUBLIC_CANVAS_ID
} as const satisfies PublicEnv

PublicEnv.parse(publicEnv)
