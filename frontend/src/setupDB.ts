import { pool } from '$lib/server/db'

let dbIsSetup = false
export async function setupDBSingleton() {
	if (dbIsSetup) {
		return
	}
	dbIsSetup = true
	const schema = `
	CREATE TABLE IF NOT EXISTS "authjs-account" (
		"userId" uuid NOT NULL,
		"type" text NOT NULL,
		"provider" text NOT NULL,
		"providerAccountId" text NOT NULL,
		"refresh_token" text,
		"access_token" text,
		"expires_at" integer,
		"token_type" text,
		"scope" text,
		"id_token" text,
		"session_state" text
	);
	--> statement-breakpoint
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "authjs-session" (
		"sessionToken" text PRIMARY KEY NOT NULL,
		"userId" uuid NOT NULL,
		"expires" timestamp NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "settings" (
		"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
		"settings" json NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "authjs-user" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" text NOT NULL,
		"key" text NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "authjs-verificationToken" (
		"identifier" text NOT NULL,
		"token" text NOT NULL,
		"expires" timestamp NOT NULL
	);
	--> statement-breakpoint
	--> statement-breakpoint
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "authjs-session" ADD CONSTRAINT "authjs-session_userId_authjs-user_id_fk" FOREIGN KEY ("userId") REFERENCES "authjs-user"("id") ON DELETE cascade ON UPDATE no action;
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
