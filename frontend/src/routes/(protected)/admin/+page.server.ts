import { DB } from '$lib/server/db'
import { fail, type Actions, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { ZodError } from 'zod'
import type { Field } from '$components/Form.svelte'
import type { Class, NewClass } from '$lib/server/schemas'
import { getFormData, getFormType, objectToForm, type Result } from '$lib/server/util'

const newClass: NewClass = {
	name: '',
	maxUsers: 0
}

function tryCastToNumber(value: string): string | number {
	if (!value) {
		return value
	}
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : value
}

type ActionReturn<Name extends string, Ok, Err = Error> = { name: Name } & Result<Ok, Err>

export const actions: Actions = {
	setSettings: async ({ request }): Promise<ActionReturn<'setSettings', string, string>> => {
		const form = await request.formData()
		const settings = Object.fromEntries(form.entries()) // TODO use getFormData()
		for (const [key, value] of Object.entries(settings)) {
			const setting = tryCastToNumber(value.toString())
			const parse = await DB.settings.set({ [key]: setting })
			if (parse instanceof ZodError) {
				return { name: 'setSettings', ok: false, error: `key ${key} with value ${value} is invalid ${parse.message}` }
			}
		}
		return { name: 'setSettings', ok: true, data: JSON.stringify(Array.from(form)) }
	},
	createClass: async ({ request }): Promise<ActionReturn<'createClass', string, string>> => {
		const keys = Object.keys(newClass) as (keyof NewClass)[]
		const formData = await getFormData(await request.formData(), keys)
		if (!formData) {
			return { name: 'createClass', ok: false, error: 'Invalid submission' }
		}

		return { name: 'createClass', ok: true, data: 'success' }
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const settings = Object.entries(await DB.settings.get()) /**/
		.map(([label, value]) => {
			return { label, value: JSON.stringify(value), type: getFormType(value) }
		})
	const { user } = await locals.auth.validateUser()
	if (!user) {
		throw fail(401)
	}
	const roles = await DB.user.getRoles(user.id)
	let classes: Class[] | undefined = undefined

	// TODO: remove === 'joppe'
	if (roles.includes('manageClasses') || user.username === 'joppe') {
		classes = await DB.class.getAll()
	}

	return { settings, _class: (await DB.user.getClasses(user.id)).at(0), newClass: objectToForm(newClass) }
}
