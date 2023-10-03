import { json, text, type RequestHandler } from '@sveltejs/kit'
import { setPixelMap } from '$lib/server/redis'
import { publicEnv } from '../../../publicEnv'
import { pixelObjToPixelKV, PixelRequest } from '../_pixelUtils'
import type { Coordinate, RGBA, Server } from '$lib/sharedTypes'
import { ratelimit } from '$lib/server/ratelimit'
import { DB } from '$lib/server/db'
import memoizee from 'memoizee'

// Adjust this value to control how often data is sent to Redis (in milliseconds)
const BATCH_INTERVAL = 100

let lastBatch = 0
let timeout: NodeJS.Timeout | undefined
const queue = new Map<Coordinate, RGBA>()

async function processBatch(io: Server) {
	const now = Date.now()
	const ago = now - lastBatch
	if (ago < BATCH_INTERVAL) {
		if (!timeout) {
			timeout = setTimeout(() => processBatch(io), BATCH_INTERVAL - ago + 1)
		}
		return
	}
	if (timeout) {
		clearTimeout(timeout)
		timeout = undefined
	}
	lastBatch = now

	if (!queue.size) {
		return
	}
	const queueObj = Object.fromEntries(queue)
	queue.clear()

	io.emit('pixelMap', queueObj)
	await setPixelMap(publicEnv.canvasId, queueObj)
}

const apiKeyExists = memoizee(
	async (key: string) => {
		// temporary for testing
		if (key === 'joppe') {
			return Promise.resolve(true)
		}

		return !!(await DB.user.getBy('apikey', key))
	},
	{ promise: true, maxAge: 10 * 1000 }
)

const maxRequests = memoizee(async () => (await DB.settings.get()).maxRequestsPerSecond, { promise: true, maxAge: 10 * 1000 })

export const POST: RequestHandler = async ({ request, locals }) => {
	const parsed = await PixelRequest.safeParseAsync(await request.json())
	if (!parsed.success) {
		return text(`Error! The request is not valid, ${parsed.error.errors.at(0)?.message}`, { status: 400 })
	}
	const apiKey = parsed.data.key
	if (!(await apiKeyExists(apiKey))) {
		return text(`Error! Your API key you provided (${apiKey}) is not valid`, { status: 401 })
	}

	const { success, timeToWait } = await ratelimit(apiKey, {
		timePeriodSeconds: 1,
		maxRequests: await maxRequests(),
		route: 'post-pixel'
	})
	if (!success) {
		return json({ success: false, timeToWait }, { status: 429 })
	}
	const [coordinate, rgba] = pixelObjToPixelKV(parsed.data)
	queue.set(coordinate, rgba)
	void processBatch(locals.io)

	locals.statsd.increment('pixel')
	const { x, y, color } = parsed.data
	return text(`Success! Pixel with color ${color} placed at x=${x}, y=${y}`, { status: 200 })
}
