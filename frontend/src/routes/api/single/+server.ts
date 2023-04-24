import { error, json, type RequestHandler } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
import { ParsedPixel } from '$api/_utils'
import type { Pixel, SocketIOMessages } from '$lib/sharedTypes'
import type { Server } from 'socket.io'
import { mapObject, type Brand } from '$util/util'

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

	const queueObj = Object.fromEntries(queue)
	queue.clear()

	const pixelValues: SocketIOMessages['pixels']['message'] = Object.values(queueObj)
	io.emit('pixels', pixelValues)

	const mapped = mapObject(queueObj, (_, { rgba }) => rgba)
	await r.hset(PUBLIC_CANVAS_ID, mapped)
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const parsed = await ParsedPixel.safeParseAsync(await request.json())
	if (!parsed.success) {
		throw error(400, 'This request is not valid please make sure you have x, y, and color like this: {x: 0, y: 0, color: [0, 0, 0, 1]}')
	}
	const { x, y, color } = parsed.data
	const rgba = `${color[0]},${color[1]},${color[2]},${color[3]}`
	const pixel: Pixel = { x, y, rgba }

	queue.set(getIdentifier(pixel), pixel)
	void processBatch(locals.io)

	return json({ message: 'Request added to batch', x, y, color })
}
