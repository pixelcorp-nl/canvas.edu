import { pool } from '$lib/server/db'

let dbIsSetup = false
export async function setupDBSingleton() {
	if (dbIsSetup) {
		return
	}
	dbIsSetup = true
	const schema = `
	CREATE TABLE IF NOT EXISTS "classes" (
		"id" text PRIMARY KEY NOT NULL,
		"name" text NOT NULL,
		"max_users" integer NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "settings" (
		"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
		"settings" json NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "user_roles" (
		"user_id" uuid NOT NULL,
		"role" text NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "users" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" text NOT NULL,
		"key" text NOT NULL,
		"class_id" text NOT NULL
	);
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "users" ADD CONSTRAINT "users_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
`
	await new Promise<void>(resolve => {
		pool.query(schema, err => {
			if (err) {
				throw err
			}
			console.log('Database setup complete')
			resolve()
		})
	})
}
