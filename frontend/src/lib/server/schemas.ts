import type { AdapterAccount } from '@auth/core/adapters'
import type { InferModel } from 'drizzle-orm'
import { integer, json, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// README
// If you wish to change the schema do the following:
// 1. Change the schema
// 2. Run `npm run generate-schema`
//    This wil generate SQL files in the db-migrations folder
// 3. Paste these queries in the hooks.server.ts file that runs these queries on startup,
//    ensuring all the tables are created

export const users = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	key: text('key').notNull()
})
export type User = InferModel<typeof users>
export const User = createSelectSchema(users, {
	name: schema => schema.name.min(1),
	key: schema => schema.key.min(1)
})
// https://orm.drizzle.team/docs/zod
export const UserInsert = createInsertSchema(users, {
	name: schema => schema.name.min(1),
	key: schema => schema.key.min(1)
}) /*.pick({
	name: true,
	key: true
})*/
export type UserInsert = z.infer<typeof UserInsert>

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
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
		.references(() => users.id, { onDelete: 'cascade' }),
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

export const settings = pgTable('settings', {
	id: integer('id').primaryKey().default(1),
	settings: json('settings').$type<Settings>().notNull()
})
export const Settings = z.object({
	maxRequestsPerSecond: z.number().min(0)
})
export type Settings = z.infer<typeof Settings>
