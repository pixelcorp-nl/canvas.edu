import { redirect, type Actions, fail } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import fs from 'fs'

export const load = async ({ locals, fetch, params }) => {
	const { user } = await locals.auth.validateUser()
	// const data = await res.json()
	if (!user) {
		return {
			user: null
		}
	} else {
		return {
			user
		}
	}
}
// const load = async (lang: string) => {
// 	const res = await fetch(`/locales/${lang}.json`)
// 	return res.json()
// }

// export const actions: Actions = {
// 	// signout
// 	default: async ({ locals }) => {
// 		const session = await locals.auth.validate()
// 		if (!session) {
// 			return fail(401)
// 		}
// 		await auth.invalidateSession(session.sessionId)
// 		locals.auth.setSession(null)
// 	}
// }
