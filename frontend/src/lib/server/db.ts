import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import postgres from 'pg'
import { privateEnv } from '../../privateEnv'
import { hasRole, randomString } from '../public/util'
import { NewClass, Settings, User, UserInsert, classToUser, classes, settings, userRoles, users, type Class, type Role } from './schemas'

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
			return (await db.insert(users).values(parse.data).returning()).at(0) as User
		},
		getBy: async <T extends keyof User>(key: T, value: User[T]): Promise<User | undefined> => {
			return (await db.select().from(users).where(eq(users[key], value)).limit(1)).at(0)
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
		getClasses: async (userId: User['id']): Promise<Class[]> => {
			const classUserMap = await db.select().from(classToUser).where(eq(classToUser.userId, userId))

			const classes = await Promise.all(classUserMap.map(map => DB.class.getBy('id', map.classId)))
			return classes.filter(d => Boolean(d)) as Class[]
		}
	},
	class: {
		getAll: async () => {
			const rows = await db /**/
				.select()
				.from(classes)
				.leftJoin(classToUser, eq(classes.id, classToUser.classId))
				.leftJoin(users, eq(classToUser.userId, users.id))

			const result = rows.reduce<(Class & { users: User[] })[]>((acc, row) => {
				const existing = acc.find(({ id }) => id === row.classes.id)
				if (!existing) {
					acc.push({
						...row.classes,
						users: row.users ? [row.users] : []
					})
					return acc
				}
				if (row.users) {
					existing.users.push(row.users)
				}
				return acc
			}, [])
			return result
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
			return classes.filter(Boolean) as Class[]
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
