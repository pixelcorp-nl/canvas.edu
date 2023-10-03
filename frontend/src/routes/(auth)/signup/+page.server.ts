import { auth } from '$lib/server/auth'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { LuciaError } from 'lucia-auth'
import type { PageServerLoad } from './$types'
import { getFormData, randomString } from '$lib/server/util'
import { privateEnv } from '$lib/../privateEnv'

function getForm(form: FormData) {
	if (privateEnv.userPasswords) {
		return getFormData(form, ['username', 'password', 'passwordConfirm'])
	} else {
		const keys = getFormData(form, ['username'])
		if (!keys) {
			return undefined
		}
		return {
			username: keys['username'],
			password: '',
			passwordConfirm: ''
		}
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const keys = getForm(await request.formData())
		if (!keys) {
			return fail(400, { message: 'Missing required fields' })
		}
		const { username, password, passwordConfirm, class_ } = keys

		// if (!(await DB.class.get(class_))) {
		// 	return fail(400, {
		// 		message: `Class "${class_}" does not exist, please contact your teacher`
		// 	})
		// }

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
			// const error = await DB.class.addUser(class_, user.id)
			// if (error instanceof Error) {
			// 	console.error(error)
			// 	return fail(500, {
			// 		message: 'Could not add user to class'
			// 	})
			// }
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
	return {
		password: privateEnv.userPasswords
	}
}
