import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = () => {
	return new Response('OK')
}
