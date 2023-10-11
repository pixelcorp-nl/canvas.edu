import type { Field } from '$components/Form.svelte'
import type { Role, User } from '$lib/server/schemas'
import { signIn as autJsSignIn, signOut as authJsSignOut } from '@auth/sveltekit/client'

/**
 * Get multiple values from a FormData object
 * @example
 * const keys = getFormData(await request.formData(), ['username', 'password'])
 * if (!keys) {
 * 	return fail(400, { message: 'Missing required fields' })
 * }
 * const { username, password } = keys
 * console.log(username)
 */
export function getFormData<Keys extends string[]>(form: FormData, keys: Readonly<Keys>): { [K in Keys[number]]: string } | undefined {
	const result = {} as { [K in Keys[number]]: K }

	let key: Keys[number]
	for (key of keys) {
		const value = form.get(key)?.toString()
		if (value === undefined) {
			return undefined
		}
		result[key] = value
	}
	return result
}

export function toNumber(value: string): number | undefined {
	if (!value) {
		return undefined
	}
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : undefined
}

export function getFormType(type: unknown): Field['type'] {
	switch (typeof type) {
		case 'number':
			return 'float'
		case 'boolean':
			return 'checkbox'
		default:
			return 'text'
	}
}

export function objectToForm(obj: Record<string, unknown>) {
	return Object.entries(obj) /**/
		.map(([label, raw]) => {
			let value = JSON.stringify(raw)
			if (value === '""') {
				value = ''
			}
			return { label, value, type: getFormType(raw) }
		})
}

export function randomString(length: number, set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
	let result = ''
	for (let i = 0; i < length; i++) {
		result += set.charAt(Math.floor(Math.random() * set.length))
	}
	return result
}

export type Result<Ok, Err = Error> =
	| {
			ok: true
			data: Ok
	  }
	| {
			ok: false
			error: Err
	  }
export function Ok<T>(data: T): { ok: true; data: T } {
	return { ok: true, data }
}
export function Err<T>(error: T): { ok: false; error: T } {
	return { ok: false, error }
}

export type Entries<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][]

export type Optional<T> = { [P in keyof T]: T[P] | undefined }

export function hasRole(roles: Role[], role: Role): boolean {
	return roles.includes(role) || roles.includes('admin')
}

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
