import postgres from 'pg'
import { privateEnv } from '../../privateEnv'
import { Settings, User, settings, user, userRoles, type Role, classUser, type Class, classes, NewClass } from './schemas'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { randomString } from './util'

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
			const rows = await db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, userId)).execute()
			return rows.map(row => row.role) as Role[]
		},
		addRole: async (userId: User['id'], role: Role): Promise<void> => {
			const roles = await DB.user.getRoles(userId)
			if (roles.includes(role)) {
				return
			}
			await db.insert(userRoles).values({ userId, role })
		},
		getClasses: async (userId: User['id']): Promise<Class[]> => {
			const classUserMap = await db.select().from(classUser).where(eq(classUser.userId, userId)).execute()
			const classes = await Promise.all(classUserMap.map(_class => DB.class.get(_class.classId)))
			return classes.filter(d => Boolean(d)) as Class[]
		}
	},
	class: {
		get: async (id: Class['id']): Promise<Class | undefined> => {
			return (await db.select().from(classes).where(eq(classes.id, id)).limit(1)).at(0)
		},
		getAll: (): Promise<Class[]> => {
			return db.select().from(classes)
		},
		getUsers: (id: Class['id']): Promise<User[]> => {
			return db.select().from(user).where(eq(classUser.classId, id)).execute()
		},
		create: async (_class: NewClass) => {
			const _classParse = await NewClass.safeParseAsync(_class)
			if (!_classParse.success) {
				return _classParse.error
			}
			const completeClass = {
				id: randomString(10), // TODO: use uuid
				key: randomString(5),
				..._classParse.data
			}
			return db.insert(classes).values(completeClass).execute()
		},
		addUser: async (userId: User['id'], classId: string): Promise<Error | void> => {
			if (!(await DB.class.get(classId))) {
				return new Error(`Class ${classId} does not exist`)
			}
			const classes = await DB.user.getClasses(userId)
			if (classes.map(({ id }) => id).includes(classId)) {
				return
			}
			await db.insert(classUser).values({ userId, classId })
		}
	}
} as const
