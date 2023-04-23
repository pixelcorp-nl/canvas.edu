import { r } from '$api/_redis'
import { isValidRequest } from '$api/_utils.js'
import { PUBLIC_CANVAS_ID } from '$env/static/public'
import { error, json, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({request}) => {
	const { x, y, color } = await request.json()
	if (!isValidRequest(x, y, color)) {
		throw error(400, 'This request is not valid please make sure you have x, y, and color like this: {x: 0, y: 0, color: [0, 0, 0, 1]}')
	}
	const rgba = `${color[0]},${color[1]},${color[2]},${color[3]}`
	const pixelKey = `${x},${y}`

	console.log('pixelKey', pixelKey, 'rgba', rgba)

	const data = await r.hset(PUBLIC_CANVAS_ID, {
		[pixelKey]: rgba
	})
	return json(data)
}
