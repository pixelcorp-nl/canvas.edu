// import { type Actions, fail } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import { json } from "sveltekit";


// export const actions: Actions = {
//     default: async ({ locals }) => {
//         const { session } = await locals.auth.validateUser();
//         if (!session) return fail(401);
//         await auth.invalidateSession(session.sessionId); // invalidate session
//         locals.auth.setSession(null); // remove cookie
//     }
// };

export const post = async ({ locals }) => {
    const { session } = await locals.auth.validateUser();
    if (!session) return json({ error: "Unauthorized" }, { status: 401 });
    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    return json({ success: true });
}
