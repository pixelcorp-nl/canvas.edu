import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { privateEnv } from '$lib/../privateEnv'
import { DB } from '$lib/server/db'

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession()
	if (session) {
		throw redirect(302, '/canvas')
	}
	return {
		// TODO: rename to usePassword
		password: privateEnv.userPasswords
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData()
		const username = form.get('username')?.toString()
		if (!username) {
			return fail(400, { message: 'Username cannot be empty' })
		}
		if (privateEnv.userPasswords) {
			const password = form.get('password')?.toString()
			const passwordConfirm = form.get('passwordConfirm')?.toString()
			if (!password) {
				return fail(400, { message: 'Password cannot be empty' })
			}
			if (password !== passwordConfirm) {
				return fail(400, { message: 'Passwords do not match' })
			}
		}
		const user = await DB.user.getBy('name', username)
		if (!user) {
			return fail(400, { message: 'Username not found, register an account' })
		}
		return { user }
	}
}
