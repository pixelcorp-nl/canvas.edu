import type { User } from '$lib/server/schemas'
import { signIn as autJsSignIn } from '@auth/sveltekit/client'

export async function signIn(user: User) {
	for (let i = 0; i < 10; i++) {
		if (window?.location?.origin !== undefined) {
			break
		}
		await new Promise(resolve => setTimeout(resolve, 500))
	}
	autJsSignIn('credentials', { ...user, redirect: false })
}
