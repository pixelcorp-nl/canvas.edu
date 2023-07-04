import { error, json, type RequestHandler } from '@sveltejs/kit'
import { getPixelMap } from '$lib/server/redis'
import { publicEnv } from '../../../publicEnv'
import { ratelimit } from '$lib/server/ratelimit'

export const GET: RequestHandler = async ({ getClientAddress }) => {
	try {
		const ratelimitResult = await ratelimit(getClientAddress(), {
			timePeriodSeconds: 60,
			maxRequests: 10,
			route: 'get-canvas'
		})

		if (!ratelimitResult.success) {
			return json(ratelimitResult, { status: 429 })
		}

		const pixelMap = await getPixelMap(publicEnv.canvasId)
		return json({ succes: true, canvas: pixelMap })
	} catch (err) {
		console.error('Error getting canvas:', err)
		throw error(500, 'Could not get canvas')
	}
}
