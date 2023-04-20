import { error, json } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
/** @type {import('./$types').RequestHandler} */

type cache = {
	[key: string]: string
}

let cache: cache
let last_request = 0
export async function GET() {
	if (cache && Date.now() - last_request < 1000) {
		console.log('cache hit')
		last_request = Date.now()
		return json(cache)
	} else {
		console.log('cache miss')
		const data = await r.hgetall(PUBLIC_CANVAS_ID)
		if (data) {
			cache = data as cache
			// console.log(data);
			last_request = Date.now()
			return json(data)
		} else {
			throw error(500, 'Could not get canvas')
		}
	}
	// return new Response(JSON.stringify(data));
}
