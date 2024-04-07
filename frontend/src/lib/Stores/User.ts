import type { FullUser } from '$lib/server/db'
import { writable } from 'svelte/store'

export const user = writable<FullUser | undefined>(undefined)
