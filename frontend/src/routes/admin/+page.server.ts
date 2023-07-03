import { DB } from '$lib/server/db'
import { fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { ZodError } from 'zod'

function tryCastToNumber(value: string): string | number {
	if (!value) {
		return value
	}
	const parsed = Number(value)
	return isNaN(parsed) ? value : parsed
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData()
		const settings = Object.fromEntries(form.entries())
		for (const [key, value] of Object.entries(settings)) {
			const setting = tryCastToNumber(value.toString())
			const parse = await DB.settings.set({ [key]: setting })
			if (parse instanceof ZodError) {
				return fail(400, { ok: false, error: `key ${key} with value ${value} is invalid ${parse.message}` })
			}
		}
		return { ok: true, value: JSON.stringify(Array.from(form)) }
	}
}

function getFormType(type: unknown) {
	switch (typeof type) {
		case 'string':
			return 'text'
		case 'number':
			return 'number'
		case 'boolean':
			return 'checkbox'
		default:
			return 'text'
	}
}

export const load: PageServerLoad = async () => {
	const settings = Object.entries(await DB.settings.get()) /**/
		.map(([key, value]) => ({ key, value: JSON.stringify(value), type: getFormType(value) }))

	return { settings }
}
