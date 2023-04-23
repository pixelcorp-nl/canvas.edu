import { error, json } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
import { isValidRequest } from '$api/_utils'

type Queue = {
	x: number
	y: number
	rgba: string
}

const queues: Queue[][] = [[], []]
let currentQueue = 0
let isBatching = false

const BATCH_INTERVAL = 5000 // Adjust this value to control how often data is sent to Redis (in milliseconds)

async function processBatch() {
	// Lock the current queue
	const lockedQueue = currentQueue
	// Switch to the next queue for new requests
	currentQueue = (currentQueue + 1) % queues.length

	// Combine queued data into a single Redis call
	const batchData = (queues[lockedQueue] as Queue[]).reduce((acc, { x, y, rgba }) => {
		const pixelKey = `${x},${y}`
		return { ...acc, [pixelKey]: rgba }
	}, {})
	console.log('Sending batch data to Redis', batchData)

	// Send the data to Redis
	await r.hset(PUBLIC_CANVAS_ID, batchData)

	// Clear the locked queue
	queues[lockedQueue] = []

	// Set the flag back to false
	isBatching = false
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { x, y, color } = await request.json()
	if (!isValidRequest(x, y, color)) {
		throw error(400, 'This request is not valid please make sure you have x, y, and color like this: {x: 0, y: 0, color: [0, 0, 0, 1]}')
	}
	const rgba = `${color[0]},${color[1]},${color[2]},${color[3]}`

	const q = queues[currentQueue] as Queue[]
	q.push({ x, y, rgba })

	if (!isBatching) {
		isBatching = true
		setTimeout(processBatch, BATCH_INTERVAL)
	}

	return json({ message: 'Request added to batch', x, y, color })
}
