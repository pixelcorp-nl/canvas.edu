export type Brand<K, T> = K & { __brand: T }

/**
 * @description Maps an object to a new object with the same keys, but different values
 */
export function mapObject<Key extends string | number | symbol, Value, NewValue>(object: Record<Key, Value>, mapFn: (key: Key, value: Value) => NewValue): Record<Key, NewValue> {
	const newObj: Record<Key, NewValue> = {} as Record<Key, NewValue>

	for (const key in object) {
		newObj[key] = mapFn(key, object[key])
	}
	return newObj
}
