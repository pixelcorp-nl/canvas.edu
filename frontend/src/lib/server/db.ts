import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import postgres from 'pg'
import { privateEnv } from '../../privateEnv'
import { hasRole, randomString } from '../public/util'
import { NewClass, Settings, User, UserInsert, classes, settings, userRoles, users, type Class, type Role } from './schemas'

export const pool = new postgres.Pool({
	connectionString: privateEnv.postgresUrl
})
export const db = drizzle(pool)

const defaultSettings: Settings = {
	maxRequestsPerSecond: 10,
	canvasId: 'default'
} as const

export type FullUser = User & { class: Class }
const defaultClassName = 'default class'

export const DB = {
	settings: {
		get: async (): Promise<Settings> => {
			const setting = (await db.select().from(settings)).at(-1)?.settings
			if (!setting || !Settings.safeParse(setting).success) {
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
			console.log(parse.data)
			return (await db.insert(users).values(parse.data).returning()).at(0) as User
		},
		getBy: async <T extends keyof User>(key: T, value: User[T]): Promise<FullUser | undefined> => {
			const us = await db.select().from(users).where(eq(users[key], value)).innerJoin(classes, eq(users.classId, classes.id)).limit(1)
			const u = us.at(0)
			return u ? { ...u.users, class: u.classes } : undefined
		},
		getAll: (): Promise<User[]> => {
			return db.select().from(users).execute()
		},
		getRoles: async (userId: User['id']): Promise<Role[]> => {
			const rows = await db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, userId))
			return rows.map(row => row.role) as Role[]
		},
		deleteBy: async <T extends keyof User>(key: T, value: User[T]): Promise<void> => {
			await db.delete(users).where(eq(users[key], value))
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
		getClass: async (userId: User['id']): Promise<Class | undefined> => {
			const user = await DB.user.getBy('id', userId)
			if (!user) {
				return undefined
			}
			return (await db.select().from(classes).where(eq(classes.id, user.classId)).limit(1)).at(0)
		}
	},
	class: {
		getAll: async () => {
			const all = await db.select().from(classes).execute()
			const full = []
			for (const _class of all) {
				const users = await DB.class.getUsers(_class.id)
				full.push({ ..._class, users })
			}
			return full
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
			return (await db.insert(classes).values(completeClass).returning()).at(0) as Class
		},
		ensureAdminClass: async () => {
			const existing = await DB.class.getBy('name', defaultClassName)
			if (existing) {
				return existing
			}
			return DB.class.create({
				maxUsers: 99999,
				name: defaultClassName
			})
		},
		addRole: async (userId: User['id'], role: Role): Promise<void> => {
			const roles = await DB.user.getRoles(userId)
			if (roles.includes(role)) {
				return
			}
			await db.insert(userRoles).values({ userId, role })
		},
		getUsers: (id: Class['id']) => {
			return db.select().from(users).where(eq(users.classId, id)).execute()
		}
	}
} as const
