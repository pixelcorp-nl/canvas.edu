import { error, json } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
import { requestValidity } from '$api/_utils.js'

type Queue = {
	x: number
	y: number
	rgba: string
}[][]

const queues: Queue = [[], []]
let currentQueue = 0
let isBatching = false

const BATCH_INTERVAL = 5000 // Adjust this value to control how often data is sent to Redis (in milliseconds)

async function processBatch() {
	// Lock the current queue
	const lockedQueue = currentQueue
	// Switch to the next queue for new requests
	currentQueue = (currentQueue + 1) % 2

	// Combine queued data into a single Redis call
	const batchData = queues[lockedQueue].reduce((acc, { x, y, rgba }) => {
		const pixelKey = `${x},${y}`
		return { ...acc, [pixelKey]: rgba }
	}, {})
	console.log(batchData, '\nSent to Redis')

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
	if (!requestValidity(x, y, color)) {
		throw error(400, 'This request is not valid please make sure you have x, y, and color like this: {x: 0, y: 0, color: [0, 0, 0, 1]}')
	} else {
		const rgba = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`

		queues[currentQueue].push({ x, y, rgba })

		if (!isBatching) {
			isBatching = true
			setTimeout(processBatch, BATCH_INTERVAL)
		}

		return json({ message: 'Request added to batch', x, y, color })
	}
}
