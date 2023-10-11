import { DB } from '$lib/server/db'
import { json, type RequestHandler } from '@sveltejs/kit'
import { privateEnv } from '$lib/../privateEnv'
import { z } from 'zod'
import { roles } from '$lib/server/schemas'

// Yes, using the name as the id is not a good idea, but it works for now
const Request = z.strictObject({
	adminKey: z.string().min(1),
	name: z.string().min(1),
	role: z.enum(roles)
})

export const POST: RequestHandler = async ({ request }) => {
	const user = await Request.safeParseAsync(await request.json())
	if (!user.success) {
		return json({ error: `Invalid request: ${user.error}` }, { status: 400 })
	}
	if (user.data.adminKey !== privateEnv.adminKey) {
		return json({ error: 'Invalid adminKey' }, { status: 401 })
	}
	const userD = await DB.user.getBy('name', user.data.name)
	if (!userD) {
		return json({ error: 'User does not exits' }, { status: 400 })
	}
	await DB.user.addRole(userD.id, user.data.role)
	return json({ message: 'Role added' }, { status: 201 })
}
