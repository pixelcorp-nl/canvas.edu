import { r } from '$api/_redis';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// const { key, value } = request.;
	await r.set('foo', 'bar');

	return new Response(String('data'));
}
