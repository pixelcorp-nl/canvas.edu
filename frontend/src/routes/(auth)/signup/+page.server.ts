import { auth } from '$lib/server/auth'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { LuciaError } from 'lucia-auth'
import type { PageServerLoad } from './$types'
import { getFormData, randomString } from '$lib/public/util'
import { DB } from '$lib/server/db'

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const keys = getFormData(await request.formData(), ['username', 'password', 'passwordConfirm', 'classId'])

		if (!keys || !keys['classId']) {
			return fail(400, { message: 'Missing required fields' })
		}
		const { username, password, passwordConfirm } = keys
		let { classId } = keys

		if (password !== passwordConfirm) {
			return fail(400, {
				message: 'Passwords do not match'
			})
		}

		if (username !== 'admin' && !(await DB.class.getBy('id', classId))) {
			return fail(400, {
				message: `Class "${classId}" does not exist, please contact your teacher`
			})
		}

		let user
		try {
			user = await auth.createUser({
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

		if (username === 'admin') {
			await DB.user.addRole(user.id, 'admin')
			const adminClassId = '0000000'
			await DB.class.create(
				{
					maxUsers: 1,
					name: 'admin'
				},
				adminClassId
			)
			classId = adminClassId
			console.log('admin user created')
		}

		const error = await DB.class.addUser(classId, user.id).catch(error => error)
		if (error instanceof Error) {
			console.error(error)
			return fail(500, {
				message: 'Could not add user to class'
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
