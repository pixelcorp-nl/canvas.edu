import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { Err, getFormData, Ok, randomString, type Result } from '$lib/public/util'
import { privateEnv } from '$lib/../privateEnv'
import { DB } from '$lib/server/db'
import type { User } from '$lib/server/schemas'

function getForm(form: FormData) {
	if (privateEnv.userPasswords) {
		return getFormData(form, ['username', 'classId', 'password', 'passwordConfirm'])
	}
	const keys = getFormData(form, ['username', 'classId'])
	if (!keys) {
		return undefined
	}
	return {
		username: keys['username'],
		classId: keys['classId'],
		password: '',
		passwordConfirm: ''
	}
}

export const actions: Actions = {
	default: async ({ request, locals }): Promise<Result<User, string>> => {
		const keys = getForm(await request.formData())
		if (!keys) {
			return Err('Missing required fields')
		}
		const { username, password, passwordConfirm, classId } = keys

		if (!username) {
			return Err('Username cannot be empty')
		}
		if (password !== passwordConfirm) {
			return Err('Passwords do not match')
		}

		if (privateEnv.userPasswords && !password) {
			return Err('Password cannot be empty')
		}
		const existing = await DB.user.getBy('name', username)
		if (existing) {
			return Err('Username already in use')
		}

		if (!(await DB.class.getBy('id', classId as string))) {
			return Err(`Class "${classId}" does not exist, please contact your teacher`)
		}

		const user = await DB.user.create({
			name: username,
			key: randomString(8),
			classId: classId as string
		})
		if (user instanceof Error) {
			return Err(user.message)
		}

		locals.statsd.increment('user.signup')
		return Ok(user)
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession()
	if (session) {
		throw redirect(302, '/canvas')
	}
	return {
		// TODO: Rename to usePassword
		password: privateEnv.userPasswords
	}
}
