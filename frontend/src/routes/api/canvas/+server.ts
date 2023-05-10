import { error, json } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { ratelimit } from '$api/_ratelimit'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
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

		const canvas = await r.hgetall(PUBLIC_CANVAS_ID)
		if (canvas) {
			return json({ succes: true, canvas })
		}
		throw error(500, 'Could not get canvas')
	} catch (err) {
		console.error('Error getting canvas:', err)
		throw error(500, 'Could not get canvas')
	}
}
