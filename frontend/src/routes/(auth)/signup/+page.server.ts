import { auth } from '$lib/server/auth'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { LuciaError } from 'lucia-auth'
import type { PageServerLoad } from './$types'
import { getFormData, randomString } from '$lib/public/util'

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const keys = getFormData(await request.formData(), ['username', 'password', 'passwordConfirm'])
		if (!keys) {
			return fail(400, { message: 'Missing required fields' })
		}
		const { username, password, passwordConfirm } = keys

		if (password !== passwordConfirm) {
			return fail(400, {
				message: 'Passwords do not match'
			})
		}

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: username ?? '',
					password: password ?? ''
				},
				attributes: {
					username: username ?? '',
					apikey: randomString(8)
				}
			})
			const session = await auth.createSession(user.id)
			locals.auth.setSession(session)
		} catch (error) {
			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return fail(400, {
					message: 'Username already in use'
				})
			}
			console.log(error)
			return fail(500, {
				message: 'Unknown error occurred'
			})
		}
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate()
	if (session) {
		throw redirect(302, '/canvas')
	}
	return {}
}
