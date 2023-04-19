import { error, json } from '@sveltejs/kit';
import { r } from '$api/_redis';
import {
	PUBLIC_CANVAS_HEIGHT,
	PUBLIC_CANVAS_ID,
	PUBLIC_CANVAS_WIDTH,
} from '$env/static/public';

type Queue = {
	x: number;
	y: number;
	rgba: string;
}[][];

let queues: Queue = [[], []];
let currentQueue = 0;
let isBatching = false;

const BATCH_INTERVAL = 5000; // Adjust this value to control how often data is sent to Redis (in milliseconds)

async function processBatch() {
	// Lock the current queue
	const lockedQueue = currentQueue;
	// Switch to the next queue for new requests
	currentQueue = (currentQueue + 1) % 2;

	// Combine queued data into a single Redis call
	const batchData = queues[lockedQueue].reduce((acc, { x, y, rgba }) => {
		const pixelKey = `${x},${y}`;
		return { ...acc, [pixelKey]: rgba };
	}, {});
	console.log(batchData, '\nSent to Redis');

	// Send the data to Redis
	await r.hset(PUBLIC_CANVAS_ID, batchData);

	// Clear the locked queue
	queues[lockedQueue] = [];

	// Set the flag back to false
	isBatching = false;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { x, y, color } = await request.json();
	// ... (existing code for validation)
	if (
		x < 0 ||
		x > PUBLIC_CANVAS_WIDTH ||
		y < 0 ||
		y > PUBLIC_CANVAS_HEIGHT ||
		!color
	) {
		throw error(400, 'Missing x, y, or color or out of bounds');
	} else if (color.length !== 4) {
		throw error(400, 'Color must be an array of 4 numbers');
	} else if (color.some((c: number) => c < 0 || c > 255)) {
		throw error(400, 'Color values must be between 0 and 255');
	} else if (color.some((c: number) => isNaN(c))) {
		throw error(400, 'Color values must be numbers');
	} else if (typeof x !== 'number' || typeof y !== 'number') {
		throw error(400, 'x and y must be numbers');
	}
	const rgba = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
	// Add the request data to the current queue
	queues[currentQueue].push({ x, y, rgba });

	// If not batching, start a new batch
	if (!isBatching) {
		isBatching = true;
		setTimeout(processBatch, BATCH_INTERVAL);
	}

	// Return a response indicating the request has been added to the batch
	return json({ message: 'Request added to batch', x, y, color });
}
