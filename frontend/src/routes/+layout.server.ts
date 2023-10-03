import type { Session } from '../hooks.server'
import type { LayoutServerLoad } from './$types'

export const load = (async event => {
	const session = await event.locals.getSession()

	return {
		session: session as Session | null
	}
}) satisfies LayoutServerLoad
