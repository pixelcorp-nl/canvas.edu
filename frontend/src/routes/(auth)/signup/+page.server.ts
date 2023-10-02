import { fail, redirect, json, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getFormData, randomString } from '$lib/server/util'
import { privateEnv } from '$lib/../privateEnv'
import { DB } from '$lib/server/db'

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
		const { username, password, passwordConfirm } = keys

		if (!username) {
			return fail(400, {
				message: 'Username cannot be empty'
			})
		}
		if (password !== passwordConfirm) {
			return fail(400, {
				message: 'Passwords do not match'
			})
		}
		if (privateEnv.userPasswords && !password) {
			return fail(400, {
				message: 'Password cannot be empty'
			})
		}
		const user = await DB.user.getBy('name', username)
		if (user) {
			return fail(400, {
				message: 'Username already in use'
			})
		}
		return { ok: true, username, key: randomString(8) }
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession()
	console.log({ session })
	if (session) {
		throw redirect(302, '/canvas')
	}
	return {
		// TODO: Rename to usePassword
		password: privateEnv.userPasswords
	}
}
