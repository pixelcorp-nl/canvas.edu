import { auth } from '$lib/server/auth'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { LuciaError } from 'lucia-auth'
import type { PageServerLoad } from './$types'

function randomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return result
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
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: username,
					password
				},
				attributes: {
					username,
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
