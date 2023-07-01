import type { InferModel } from 'drizzle-orm'
import { bigint, boolean, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// README
// If you wish to change the schema do the following:
// 1. Change the schema
// 2. Run `npm run generate-schema`
//    This wil generate SQL files in the db-migrations folder
// 3. Paste these queries in the hooks.server.ts file that runs these queries on startup,
//    ensuring all the tables are created

// https://lucia-auth.com/adapters/drizzle?
export const session = pgTable('auth_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
})

// https://lucia-auth.com/adapters/drizzle?
export const key = pgTable('auth_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 })
		.notNull()
		.references(() => user.id),
	primaryKey: boolean('primary_key').notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 }),
	expires: bigint('expires', { mode: 'number' })
})

// https://lucia-auth.com/adapters/drizzle?
export const user = pgTable('auth_user', {
	id: varchar('id', { length: 15 }).primaryKey(), // default value from lucia, do not change
	username: text('username').notNull(),
	apikey: text('apikey').notNull()
})
export const User = createInsertSchema(user)
export type User = InferModel<typeof user>
export type UserAttributes = Omit<User, 'id'>
export type NewUser = InferModel<typeof user, 'insert'>

export const settings = pgTable('settings', {
	settings: text('settings').notNull()
})
export const Settings = z.object({
	timeout: z.number().min(0)
})
export type Settings = z.infer<typeof Settings>
