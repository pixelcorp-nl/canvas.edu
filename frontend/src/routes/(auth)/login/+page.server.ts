import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { privateEnv } from '$lib/../privateEnv'
import { getFormData } from '$lib/server/util'

export const load: PageServerLoad = async ({ locals }) => {
	// const session = await locals.auth.validate()
	// if (session) {
	// 	throw redirect(302, '/canvas')
	// }
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
		return fail(500, {
			message: 'Not implemented'
		})
	}
}
