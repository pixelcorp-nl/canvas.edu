import { r } from '$api/_redis';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// const { key, value } = request.;
	const data = await r.set('foo', 'bar');

	console.log(data);

	return new Response(String(data));
}
