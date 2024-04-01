import { DB } from '$lib/server/db'
import { fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { ZodError } from 'zod'
import { getFormData, getFormType, objectToForm, type Entries, type Result, toNumber, type Optional, hasRole } from '$lib/public/util'
import type { NewClass, User } from '$lib/server/schemas'
import { getAllPixelMapIds } from '$lib/server/redis'

// Because we do some auth check in the frontend code, this is required
export const prerender = false
export const ssr = true

type ActionReturn<Name extends string, Ok, Err = Error> = { name: Name } & Result<Ok, Err>

export const actions: Actions = {
	setSettings: async ({ request, locals }): Promise<ActionReturn<'setSettings', string, string>> => {
		const settings = getFormData(await request.formData(), ['maxRequestsPerSecond'])
		if (!settings) {
			return { name: 'setSettings', ok: false, error: 'Invalid submission' }
		}
		const session = await locals.getSession()
		const user = session?.user as User | null
		if (!(await DB.user.hasRole(user?.id, 'canvasSettings'))) {
			return { name: 'setSettings', ok: false, error: 'No roles' }
		}

		for (const [key, value] of Object.entries(settings) as Entries<typeof settings>) {
			const parse = await DB.settings.set({ [key]: Number(value) })
			if (parse instanceof ZodError) {
				return { name: 'setSettings', ok: false, error: `key ${key} with value ${value} is invalid ${parse.message}` }
			}
		}
		return { name: 'setSettings', ok: true, data: 'Success' }
	},

	createClass: async ({ request, locals }): Promise<ActionReturn<'createClass', string, string>> => {
		const session = await locals.getSession()
		const user = session?.user as User | null

		if (!(await DB.user.hasRole(user?.id, 'classes:manage'))) {
			return { name: 'createClass', ok: false, error: 'You do not have the roles to do that' }
		}

		const form = await request.formData()
		const newClass: Optional<NewClass> = {
			name: form.get('name')?.toString(),
			maxUsers: toNumber(form.get('maxUsers')?.toString() ?? '')
		}

		const result = await DB.class.create(newClass as unknown as NewClass)
		if (result instanceof ZodError) {
			return { name: 'createClass', ok: false, error: `Invalid input ${result.message}` }
		}

		return { name: 'createClass', ok: true, data: 'success' }
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const settings = Object.entries(await DB.settings.get()).map(([label, value]) => {
		return { label, value: JSON.stringify(value), type: getFormType(value) }
	})
	const session = await locals.getSession()
	const user = session?.user as User | null
	if (!user) {
		throw fail(401)
	}
	const roles = await DB.user.getRoles(user.id)
	const classes = hasRole(roles, 'classes:manage') ? await DB.class.getAll() : undefined
	const newClass: NewClass = {
		name: '',
		maxUsers: 0
	}
	const users = hasRole(roles, 'users:manage') ? await DB.user.getAll() : undefined
	return { roles, settings, classes, newClass: objectToForm(newClass), users, canvasIds: getAllPixelMapIds() }
}
