import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser()
	// const data = await res.json()
	if (!user) {
		throw redirect(307, '/login')
	} else {
		return {
			user
		}
	}
}
