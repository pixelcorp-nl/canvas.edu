import type { User } from '$lib/server/schemas'
import { signIn as autJsSignIn } from '@auth/sveltekit/client'

export function signIn(user: User) {
	autJsSignIn('credentials', user)
}
