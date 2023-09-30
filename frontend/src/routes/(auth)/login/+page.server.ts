import { auth } from '$lib/server/auth'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { LuciaError } from 'lucia-auth'
import type { PageServerLoad } from './$types'
import { privateEnv } from '$lib/../privateEnv'
import { getFormData } from '$lib/server/util'

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate()
	if (session) {
		throw redirect(302, '/canvas')
	}
	return {
		password: privateEnv.userPasswords
	}
}

function getForm(form: FormData) {
	if (privateEnv.userPasswords) {
		return getFormData(form, ['username', 'password', 'passwordConfirm'])
	} else {
		const keys = getFormData(form, ['username'])
		if (!keys) {
			return undefined
		}
		return {
			username: keys['username'] ?? '',
			password: ''
		}
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const keys = getForm(await request.formData())
		if (!keys) {
			return fail(400, { message: 'Missing required fields' })
		}
		try {
			const key = await auth.useKey('username', keys['username'] as string, keys['password'] as string)
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
