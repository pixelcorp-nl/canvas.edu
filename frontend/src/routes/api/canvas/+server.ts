import { error, json } from '@sveltejs/kit'
import { r } from '$api/_redis'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
/** @type {import('./$types').RequestHandler} */

export type Cache = Record<string, string>

let cache: Cache
let last_request = 0
export async function GET() {
	if (cache && Date.now() - last_request < 1000) {
		last_request = Date.now()
		return json(cache)
	}

	const data = await r.hgetall(PUBLIC_CANVAS_ID)
	if (data) {
		cache = data as Cache
		last_request = Date.now()
		return json(data)
	}
	throw error(500, 'Could not get canvas')
}
