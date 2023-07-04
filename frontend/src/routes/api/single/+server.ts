import { json, type RequestHandler } from '@sveltejs/kit'
import { setPixelMap } from '$lib/server/redis'
import { publicEnv } from '../../../publicEnv'
import { pixelObjToPixelKV, PixelRequest } from '../_pixelUtils'
import type { Coordinate, RGBA, Server } from '$lib/sharedTypes'
import { ratelimit } from '$lib/server/ratelimit'
import { pool } from '$lib/server/auth'

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

function apiKeyExists(key: string): Promise<boolean> {
	// temporary for testing
	if (key === 'joppe') {
		return Promise.resolve(true)
	}

	return new Promise(resolve => {
		pool.query(`SELECT * FROM auth_user WHERE apikey = $1`, [key], (err, result) => resolve(!err && result.rowCount > 0))
	})
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const parsed = await PixelRequest.safeParseAsync(await request.json())
	if (!parsed.success) {
		const pixel: PixelRequest = { x: 10, y: 10, color: [255, 0, 0], key: 'your-api-key' }
		const resp = { success: false, error: `The request is not valid, your request should look like this ${JSON.stringify(pixel)}` }
		return json(resp, { status: 400 })
	}
	const apiKey = parsed.data.key
	if (!(await apiKeyExists(apiKey))) {
		const resp = { success: false, error: `The API key you provided (${apiKey}) is not valid` }
		return json(resp, { status: 401 })
	}

	const { success, timeToWait } = await ratelimit(apiKey, {
		timePeriodSeconds: 1,
		maxRequests: (await DB.settings.get()).maxRequestsPerSecond,
		route: 'post-pixel'
	})
	if (!success) {
		return json({ success: false, timeToWait }, { status: 429 })
	}
	const [coordinate, rgba] = pixelObjToPixelKV(parsed.data)
	queue.set(coordinate, rgba)
	void processBatch(locals.io)

	locals.statsd.increment('pixel')
	return json({ success: true, x: parsed.data.x, y: parsed.data.y, color: parsed.data.color })
}
