import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async event => {
	const session = await event.locals.getSession()
	// if (!session?.user) {
	// 	throw redirect(303, '/auth')
	// }
	const user = session?.user
	// if (!user) {
	// 	throw redirect(303, '/auth')
	// }
	// if (!user.apikey) {
	// 	throw redirect(303, '/auth')
	// }
	return {
		session: session,
		user
	}
}) satisfies LayoutServerLoad
