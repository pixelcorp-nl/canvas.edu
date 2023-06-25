import { auth } from '$lib/server/auth'

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser()
	if (!user) {
		return {
			user: null
		}
	}
	return {
		user
	}
}