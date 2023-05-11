import { error, json } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { publicEnv } from '../../../publicEnv'

/** @type {import('./$types').RequestHandler} */

export async function GET({ getClientAddress }) {
	try {
		const ratelimitResult = await ratelimit(getClientAddress(), {
			timePeriodSeconds: 60,
			maxRequests: 10,
			route: 'get-canvas'
		})

		if (!ratelimitResult.success) {
			return json(ratelimitResult, { status: 429 })
		}

	const data = await r.hgetall(publicEnv.canvasId)
	if (data) {
		cache = data as Cache
		last_request = Date.now()
		return json(data)
	}
}
