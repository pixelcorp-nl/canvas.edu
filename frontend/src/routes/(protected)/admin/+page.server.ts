import { DB } from '$lib/server/db'
import { fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { ZodError } from 'zod'
import type { Field } from '$components/Form.svelte'
import { getAllPixelMapIds } from '$lib/server/redis'

function tryCastToNumber(value: string): string | number {
	if (!value) {
		return value
	}
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : value
}

export const actions: Actions = {
	settings: async ({ request }) => {
		const form = await request.formData()
		const settings = Object.fromEntries(form.entries())
		const settingsParsed = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, tryCastToNumber(value as string)] as const))
		const response = await DB.settings.set(settingsParsed)
		if (response instanceof ZodError) {
			return fail(400, { ok: false, error: { message: response.errors } })
		}
		return { ok: true, value: JSON.stringify(Array.from(form)) }
	}
}

function getFormType(type: unknown): Field['type'] {
	switch (typeof type) {
		case 'number':
			return 'float'
		case 'boolean':
			return 'checkbox'
		default:
			return 'text'
	}
}

export const load: PageServerLoad = async () => {
	const settings = Object.entries(await DB.settings.get()) /**/
		.map(([label, value]) => {
			return { label, value: value.toString(), type: getFormType(value) }
		})

	return { settings, canvasIds: getAllPixelMapIds() }
}
