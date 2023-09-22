import postgres from 'pg'
import { privateEnv } from '../../privateEnv'
import { Settings, User, settings, user, type Role, NewClass, classes, userRoles } from './schemas'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { hasRole, randomString } from '$lib/public/util'

export const pool = new postgres.Pool({
	connectionString: privateEnv.postgresUrl
})
export const db = drizzle(pool)

const defaultSettings: Settings = {
	maxRequestsPerSecond: 10
} as const
export const DB = {
	settings: {
		get: async (): Promise<Settings> => {
			const setting = (await db.select().from(settings)).at(-1)?.settings
			if (!setting) {
				return defaultSettings
			}
			return setting
		},
		set: async (setting: Partial<Settings>) => {
			const existing = await DB.settings.get()
			const newSettings = {
				...existing,
				...setting
			}
			const parse = await Settings.safeParseAsync(setting)
			if (!parse.success) {
				return parse.error
			}
			// Make sure that we only ever have one row
			if (!(await db.select().from(settings).limit(1).execute()).length) {
				await db.insert(settings).values({ settings: newSettings }).execute()
				return
			}
			return db.update(settings).set({ settings: newSettings }).execute()
		}
	},
	user: {
		getBy: async <T extends keyof User>(key: T, value: User[T]): Promise<User | undefined> => {
			return (await db.select().from(user).where(eq(user[key], value)).limit(1)).at(0)
		},
		getRoles: async (userId: User['id']): Promise<Role[]> => {
			const rows = await db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, userId))
			return rows.map(row => row.role) as Role[]
		},
		// because a an admin has all roles this function always returns true if the user is an admin
		hasRole: async (userId: User['id'] | undefined, role: Role): Promise<boolean> => {
			if (!userId) {
				return false
			}
			const roles = await DB.user.getRoles(userId)
			return hasRole(roles, role)
		}
	},
	class: {
		getAll: () => {
			return db.select().from(classes)
		},
		create: async (_class: NewClass, id?: string) => {
			const _classParse = await NewClass.safeParseAsync(_class)
			if (!_classParse.success) {
				return _classParse.error
			}
			const completeClass = {
				id: id ?? randomString(7, '123456789'),
				..._classParse.data
			}
			return db.insert(classes).values(completeClass).returning()
		}
	}
} as const
