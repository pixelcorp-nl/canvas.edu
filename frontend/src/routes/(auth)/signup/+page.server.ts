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
		const { username, password, passwordConfirm } = keys
		let { classId } = keys

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

		if (!username.startsWith(privateEnv.adminKey) && !(await DB.class.getBy('id', classId))) {
			return Err(`Class "${classId}" does not exist, please contact your teacher`)
		}

		const user = await DB.user.create({
			name: username,
			key: randomString(8)
		})
		if (user instanceof Error) {
			return Err(user.message)
		}

		if (username.startsWith(privateEnv.adminKey)) {
			await DB.user.addRole(user.id, 'admin')
			const _classs = await DB.class.create({
				maxUsers: 1,
				name: username
			})
			if (_classs instanceof Error) {
				console.error(_classs)
				return Err('Could not create admin class')
			}
			classId = _classs.id
			console.log(`admin user created, username: ${username} classId: ${classId}`)
		}

		const userClassMap = await DB.class.addUser(classId, user.id)
		if (userClassMap instanceof Error) {
			return Err('Could not add user to class')
		}

		if (!username.startsWith(privateEnv.adminKey)) {
			console.log(`user created, username: ${username} classId: ${classId}`)
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
