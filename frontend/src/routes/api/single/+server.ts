import { text, type RequestHandler } from '@sveltejs/kit'
import { setPixelMap } from '$lib/server/redis'
import { PixelBase, pixelObjToPixelKV, PixelRequest } from '../_pixelUtils'
import type { Coordinate, RGB, Server } from '$lib/sharedTypes'
import { rateLimit } from '$lib/server/ratelimit'
import { DB, getUserMemoized } from '$lib/server/db'
import memoizee from 'memoizee'

// Adjust this value to control how often data is sent to Redis
const BATCH_INTERVAL_MS = 100

let lastBatch = 0
let timeout: NodeJS.Timeout | undefined

// map of canvasId to map of coordinates to RGB values
// we batch the pixels per canvas
const queue = new Map<string, Map<Coordinate, RGB>>()

function ensureClassQueue(canvasId: string) {
	const q = queue.get(canvasId)
	if (q) {
		return q
	}
	const map = new Map<Coordinate, RGB>()
	queue.set(canvasId, map)
	return map
}

async function processBatch(io: Server, canvasId: string) {
	const now = Date.now()
	const ago = now - lastBatch
	if (ago < BATCH_INTERVAL_MS) {
		if (!timeout) {
			timeout = setTimeout(() => processBatch(io, canvasId), BATCH_INTERVAL_MS - ago + 1)
		}
		return
	}
	if (timeout) {
		clearTimeout(timeout)
		timeout = undefined
	}
	lastBatch = now

	const classQueue = ensureClassQueue(canvasId)
	if (!classQueue.size) {
		return
	}

	const queueObj = Object.fromEntries(classQueue)
	classQueue.clear()
	io.to(canvasId).emit('pixelMap', queueObj)

	await setPixelMap(canvasId, queueObj)
}

const maxRequests = memoizee(async () => (await DB.settings.get()).maxRequestsPerSecond, { promise: true, maxAge: 10 * 1000 })

export const POST: RequestHandler = async ({ request, locals }) => {
	const parsed = await PixelRequest.safeParseAsync(await request.json())
	if (!parsed.success) {
		return text(`Error! The request is not valid, ${parsed.error.errors.at(0)?.message}`, { status: 400 })
	}
	const apiKey = parsed.data.key
	const user = await getUserMemoized('key', apiKey)
	if (!user) {
		return text(`Error! Your API key you provided (${apiKey}) is not valid`, { status: 401 })
	}

	if (!user.roles.includes('admin')) {
		const { success, timeToWaitMs: timeToWait } = await rateLimit(apiKey, {
			timePeriodSeconds: 1,
			maxRequests: await maxRequests(),
			route: 'post-pixel'
		})
		if (!success) {
			return text(`Error! You are being ratelimited. Please wait ${timeToWait} milliseconds before trying again.`, { status: 429 })
		}
	}

	const pixel: PixelBase = {
		x: Math.round(parsed.data.x),
		y: Math.round(parsed.data.y),
		color: parsed.data.color
	}
	const [coordinate, rgb] = pixelObjToPixelKV(pixel)
	const classQueue = ensureClassQueue(user.class.id)
	classQueue.set(coordinate, rgb)

	void processBatch(locals.io, user.class.id)

	locals.statsd.increment('pixel')

	return text(`Success! Pixel with color ${pixel.color} placed at x=${pixel.x}, y=${pixel.y}`, { status: 200 })
}
