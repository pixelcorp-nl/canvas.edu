import { error, json, type RequestHandler } from '@sveltejs/kit'
import { getPixelMap } from '$lib/server/redis'
import { rateLimit } from '$lib/server/ratelimit'
import type { FullUser } from '$lib/server/db'

export const GET: RequestHandler = async ({ getClientAddress, locals }) => {
	try {
		const rateLimitResult = await rateLimit(getClientAddress(), {
			timePeriodSeconds: 60,
			maxRequests: 10,
			route: 'get-canvas'
		})

		if (!rateLimitResult.success) {
			return json(rateLimitResult, { status: 429 })
		}

		const session = await locals.getSession()
		const user = session?.user as FullUser | null
		if (!user) {
			throw error(401, 'Not logged in')
		}

		const pixelMap = await getPixelMap(user.class.id)
		return json({ succes: true, canvas: pixelMap })
	} catch (err) {
		console.error('Error getting canvas:', err)
		throw error(500, 'Could not get canvas')
	}
}
