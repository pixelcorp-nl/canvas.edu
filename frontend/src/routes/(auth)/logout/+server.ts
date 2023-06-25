// import { type Actions, fail } from "@sveltejs/kit";
import { auth } from '$lib/server/auth'
import { json, redirect } from '@sveltejs/kit'

// export const actions: Actions = {
//     default: async ({ locals }) => {
//         const { session } = await locals.auth.validateUser();
//         if (!session) return fail(401);
//         await auth.invalidateSession(session.sessionId); // invalidate session
//         locals.auth.setSession(null); // remove cookie
//     }
// };

export const POST = async ({ locals }) => {
	const { session } = await locals.auth.validateUser()
	if (!session) {
		throw redirect(307, '/')
	}
	await auth.invalidateSession(session.sessionId) // invalidate session
	locals.auth.setSession(null) // remove cookie
	throw redirect(307, '/')
}
