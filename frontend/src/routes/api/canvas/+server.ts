import { error, json } from '@sveltejs/kit';
import { r } from '$api/_redis';
import { PUBLIC_CANVAS_ID } from '$env/static/public';
/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const data = await r.hgetall(PUBLIC_CANVAS_ID);
	return new Response(JSON.stringify(data));
}
