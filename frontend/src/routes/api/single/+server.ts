import { r } from '$api/_redis';
import {
	PUBLIC_CANVAS_HEIGHT,
	PUBLIC_CANVAS_ID,
	PUBLIC_CANVAS_WIDTH,
} from '$env/static/public';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { x, y, color } = await request.json();
	console.log(x, y, color);
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
	const pixelKey = `${x},${y}`;

	const data = await r.hset(PUBLIC_CANVAS_ID, {
		[pixelKey]: rgba,
	});
	return new Response(String(data));
}
