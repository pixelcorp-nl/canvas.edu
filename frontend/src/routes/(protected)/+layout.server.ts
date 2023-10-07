import { redirect } from '@sveltejs/kit'
import { publicEnv } from '$lib/../publicEnv'
import type { Session } from '../../hooks.server'
/**
 * is a pure function
 */
function stringToLocation(key: string) {
	const max = Math.min(publicEnv.canvasWidth, publicEnv.canvasHeight)
	let n = Math.round(max / 2)
	for (let i = 0; i < key.length; i++) {
		n += key.charCodeAt(i) * 7
	}
	return {
		x: n % max,
		y: (n * 7) % max
	}
}

export const load = async ({ locals }) => {
	// type assertion here because auth.js doesn't infer correctly
	const session = (await locals.getSession()) as Session
	if (!session?.user) {
		throw redirect(307, '/login')
	}
	return {
		user: session,
		infoPixel: stringToLocation(session.user?.key ?? 'abc')
	}
}
