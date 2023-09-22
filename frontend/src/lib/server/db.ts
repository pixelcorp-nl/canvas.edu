import postgres from 'pg'
import { privateEnv } from '../../privateEnv'
import { Settings, User, settings, user, userRoles, type Role, classToUser, type Class, classes, NewClass } from './schemas'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { hasRole, randomString } from '../public/util'

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
		deleteBy: async <T extends keyof User>(key: T, value: User[T]): Promise<void> => {
			await db.delete(user).where(eq(user[key], value))
		},
		addRole: async (userId: User['id'], role: Role): Promise<void> => {
			const roles = await DB.user.getRoles(userId)
			if (roles.includes(role)) {
				return
			}
			await db.insert(userRoles).values({ userId, role })
		},
		// because a an admin has all roles this function always returns true if the user is an admin
		hasRole: async (userId: User['id'] | undefined, role: Role): Promise<boolean> => {
			if (!userId) {
				return false
			}
			const roles = await DB.user.getRoles(userId)
			return hasRole(roles, role)
		},
		getClasses: async (userId: User['id']): Promise<Class[]> => {
			const classUserMap = await db.select().from(classToUser).where(eq(classToUser.userId, userId))

			const classes = await Promise.all(classUserMap.map(map => DB.class.getBy('id', map.classId)))
			return classes.filter(d => Boolean(d)) as Class[]
		}
	},
	class: {
		getAll: () => {
			return db.select().from(classes)
		},
		getBy: async <T extends keyof Class>(key: T, value: Class[T]): Promise<Class | undefined> => {
			return (await db.select().from(classes).where(eq(classes[key], value)).limit(1)).at(0)
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
		},
		addRole: async (userId: User['id'], role: Role): Promise<void> => {
			const roles = await DB.user.getRoles(userId)
			if (roles.includes(role)) {
				return
			}
			await db.insert(userRoles).values({ userId, role })
		},
		getClasses: async (userId: User['id']): Promise<Class[]> => {
			const classUserMap = await db.select().from(classToUser).where(eq(classToUser.userId, userId))
			const classes = await Promise.all(classUserMap.map(_class => DB.class.getBy('id', _class.classId)))
			return classes.filter(d => Boolean(d)) as Class[]
		},
		getUsers: async (id: Class['id']) => {
			const ids = await db.select().from(classToUser).where(eq(classToUser.classId, id))
			return Promise.all(ids.map(({ userId }) => DB.user.getBy('id', userId)))
		},
		addUser: async (classId: string, userId: User['id']) => {
			const _class = await DB.class.getBy('id', classId)
			if (!_class) {
				return new Error(`Class with id ${classId} does not exist`)
			}
			const classes = await DB.user.getClasses(userId)
			if (classes.map(({ id }) => id).includes(classId)) {
				return
			}
			const users = (await DB.class.getUsers(classId)).length
			if (users >= _class.maxUsers) {
				return new Error(`Class with id ${classId} is full`)
			}
			return db.insert(classToUser).values({ userId, classId }).returning()
		}
	}
} as const
