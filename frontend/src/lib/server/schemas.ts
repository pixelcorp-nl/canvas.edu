import type { AdapterAccount } from '@auth/core/adapters'
import type { InferModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { integer, json, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// README
// If you wish to change the schema do the following:
// 1. Change the schema
// 2. Run `npm run generate-schema`
//    This wil generate SQL files in the db-migrations folder
// 3. Paste these queries in the hooks.server.ts file that runs these queries on startup,
//    ensuring all the tables are created

export const user = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image')
})

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	account => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId)
	})
)

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
})

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	vt => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
)

export const User = createInsertSchema(user)
export type User = InferModel<typeof user>
export type UserAttributes = Omit<User, 'id'>
export type NewUser = InferModel<typeof user, 'insert'>

export const settings = pgTable('settings', {
	id: integer('id').primaryKey().default(1),
	settings: json('settings').$type<Settings>().notNull()
})
export const Settings = z.object({
	maxRequestsPerSecond: z.number().min(0)
})
export type Settings = z.infer<typeof Settings>
