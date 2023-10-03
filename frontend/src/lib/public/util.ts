import type { User } from '$lib/server/schemas'
import { onMount } from 'svelte'
import { signIn as autJsSignIn } from '@auth/sveltekit/client'

export function waitForMount<T>(data?: T) {
	return new Promise<T | undefined>(resolve => {
		onMount(() => resolve(data))
	})
}

// TODO: use this instead of waitForMount().then(autJsSignIn)
export async function signIn(user: User) {
	await waitForMount(user)
	autJsSignIn('credentials', user)
}
