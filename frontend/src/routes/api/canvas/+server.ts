import { error, json, type RequestHandler } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { publicEnv } from '../../../publicEnv'
import { ratelimit } from '$api/_ratelimit'

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

		const canvas = await r.hgetall(publicEnv.canvasId)
		return json({ succes: true, canvas })
	} catch (err) {
		console.error('Error getting canvas:', err)
		throw error(500, 'Could not get canvas')
	}
}
