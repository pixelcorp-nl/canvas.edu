import type { User } from '$lib/server/schemas'
import { signIn as autJsSignIn, signOut as authJsSignOut } from '@auth/sveltekit/client'

async function waitForWindow() {
	for (let i = 0; i < 10; i++) {
		if (window?.location?.origin !== undefined) {
			break
		}
		await new Promise(resolve => setTimeout(resolve, 500))
	}
}

export async function signIn(user: User) {
	await waitForWindow()
	await autJsSignIn('credentials', { ...user, redirect: false })
	window.location.href = '/canvas'
}

export async function signOut() {
	await waitForWindow()
	await authJsSignOut({ callbackUrl: window.location.origin })
}
