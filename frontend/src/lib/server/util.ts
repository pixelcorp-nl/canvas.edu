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

export function randomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return result
}
