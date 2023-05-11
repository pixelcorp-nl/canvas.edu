import { error, json, type RequestHandler } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { publicEnv } from '../../../publicEnv'
import { ParsedPixel } from '$api/_utils'
import type { Pixel, Server } from '$lib/sharedTypes'
import { mapObject, type Brand } from '$util/util'
import { ratelimit } from '$api/_ratelimit'

type Identifier = Brand<string, 'Identifier'>

// Adjust this value to control how often data is sent to Redis (in milliseconds)
const BATCH_INTERVAL = 100

let lastBatch = 0
let timeout: NodeJS.Timeout | undefined
const queue = new Map<Identifier, Pixel>()

function getIdentifier({ x, y }: Pixel): Identifier {
	return `${x},${y}` as Identifier
}

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

	io.emit('pixels', Object.values(queueObj))

	const mapped = mapObject(queueObj, (_, { rgba }) => rgba)
	await r.hset(publicEnv.canvasId, mapped)
}

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	try {
		const { success, timeToWait } = await ratelimit(getClientAddress(), {
			timePeriodSeconds: 1,
			maxRequests: 10,
			route: 'post-pixel'
		})

		if (!success) {
			return json({ success, timeToWait }, { status: 429 })
		} else {
			const parsed = await ParsedPixel.safeParseAsync(await request.json())
			if (!parsed.success) {
				throw error(400, 'This request is not valid please make sure you have x, y, and color like this: {x: 0, y: 0, color: [0, 0, 0, 1]}')
			}
			const { x, y, color } = parsed.data
			const rgba = `${color[0]},${color[1]},${color[2]},${color[3]}`
			const pixel: Pixel = { x, y, rgba }

			queue.set(getIdentifier(pixel), pixel)
			void processBatch(locals.io)

			locals.statsd.increment('pixel')
			return json({ success: true, message: 'Request added to batch', x, y, color })
		}
	} catch (error) {
		console.error(error)
		return json({ success: false, error }, { status: 500 })
	}
}
