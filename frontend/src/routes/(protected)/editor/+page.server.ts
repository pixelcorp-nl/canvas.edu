import { DB } from '$lib/server/db'
import { fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { ZodError } from 'zod'
import type { Field } from '$components/Form.svelte'
import { getAllPixelMapIds } from '$lib/server/redis'
import { markdownToHtml } from '$lib/server/markdownToHtml'

const inputs = [
	{
		label: 'examplePage',
		value: 'todo',
		type: 'textarea'
	}
] as const satisfies Field[]

export const actions: Actions = {
	settings: async ({ request }) => {
		const form = await request.formData()

		// has object with inputs[number].label as key and value as value
		const settings = Object.fromEntries(form.entries()) as Record<(typeof inputs)[number]['label'], string>
		const informationPage = markdownToHtml(settings.examplePage)

		console.log(settings)
		return { ok: true, informationPage }
	}
}

export const load: PageServerLoad = async () => {
	return { settings: inputs }
}
