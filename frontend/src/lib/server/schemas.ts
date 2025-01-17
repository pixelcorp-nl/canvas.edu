import { integer, json, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// README
// If you wish to change the schema do the following:
// 1. Change the schema
// 2. Run `npm run generate-schema`
//    This wil generate SQL files in the db-migrations folder
// 3. Paste these queries in the hooks.server.ts file that runs these queries on startup,
//    ensuring all the tables are created

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	key: text('key').notNull(),
	classId: text('class_id')
		.references(() => classes.id)
		.notNull()
})
export type User = typeof users.$inferSelect;
export const User = createSelectSchema(users, {
	name: schema => schema.min(1),
	key: schema => schema.min(1)
})
// https://orm.drizzle.team/docs/zod
export const UserInsert = createInsertSchema(users, {
	name: schema => schema.min(1),
	key: schema => schema.min(1)
}) /*.pick({
	name: true,
	key: true
})*/
export type UserInsert = z.infer<typeof UserInsert>

export const userRoles = pgTable('user_roles', {
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	// we could use a enum for the role, but we will enforce the role at the application level
	role: text('role').notNull()
})
export const roles = ['stats', 'canvasSettings', 'classes:manage', 'users:manage', 'admin'] as const
export type Role = (typeof roles)[number]
export type UserRole = typeof userRoles.$inferSelect
export type NewUserRole = typeof userRoles.$inferInsert

export const classes = pgTable('classes', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	maxUsers: integer('max_users').notNull()
})
export type Class = typeof classes.$inferSelect
export const Class = z.strictObject({
	id: z
		.string()
		.min(1)
		.max(128)
		.regex(/^[a-zA-Z0-9]+$/),
	name: z.string().min(1).max(128),
	maxUsers: z.number().int().min(0)
})

export const settings = pgTable('settings', {
	id: integer('id').primaryKey().default(1),
	settings: json('settings').$type<Settings>().notNull()
})
export const Settings = z.strictObject({
	maxRequestsPerSecond: z.number().min(0)
})
export type Settings = z.infer<typeof Settings>
