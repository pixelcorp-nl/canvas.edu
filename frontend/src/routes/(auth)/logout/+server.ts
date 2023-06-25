import { json } from '@sveltejs/kit'

export const POST = ({ cookies }) => {
	/**
	 * !TODO: invalidate session properly
	 */
	// const { session } = await locals.auth.validateUser()
	// console.log('session', session)
	// if (session) {
	// 	await auth.invalidateSession(session.sessionId)
	// }
	cookies.delete('auth_session')
	return json({ success: true })
}
