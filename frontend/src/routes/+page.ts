import type { PageLoad } from './$types'

export const load = (async ({ fetch }) => {
	const data = await fetch('/api/canvas')
	if (data.ok) {
		return { props: await data.json() }
	}
	return { error: data.status }
}) satisfies PageLoad
