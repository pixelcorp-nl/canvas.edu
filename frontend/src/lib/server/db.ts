import postgres from 'pg'
import { privateEnv } from '../../privateEnv'
import { Settings, settings, users, UserInsert, type User } from './schemas'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

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
				return db.insert(settings).values({ settings: newSettings }).returning()
			}
			return db.update(settings).set({ settings: newSettings }).returning()
		}
	},
	user: {
		create: async (user: UserInsert) => {
			const parse = await UserInsert.safeParseAsync(user)
			if (!parse.success) {
				return parse.error
			}
			return (await db.insert(users).values(parse.data).returning()).at(0) as User
		},
		getBy: async <T extends keyof User>(key: T, value: User[T]): Promise<User | undefined> => {
			return (await db.select().from(users).where(eq(users[key], value)).limit(1)).at(0)
		}
	}
} as const
