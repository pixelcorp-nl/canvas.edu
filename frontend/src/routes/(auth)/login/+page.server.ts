import { auth } from '$lib/server/auth'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { LuciaError } from 'lucia-auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate()
	if (session) {
		throw redirect(302, '/canvas')
	}
	return {}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData()
		const username = form.get('username')
		const password = form.get('password')
		if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid input'
			})
		}
		try {
			const key = await auth.useKey('username', username, password)
			const session = await auth.createSession(key.userId)
			locals.auth.setSession(session)
		} catch (error) {
			if (error instanceof LuciaError && (error.message === 'AUTH_INVALID_KEY_ID' || error.message === 'AUTH_INVALID_PASSWORD')) {
				return fail(400, {
					message: 'Incorrect username or password.'
				})
			}
			// database connection error
			console.log(error)
			return fail(500, {
				message: 'Unknown error occurred'
			})
		}
	}
}
