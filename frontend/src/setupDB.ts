import { pool } from '$lib/server/db'

let dbIsSetup = false
export async function setupDBSingleton() {
	if (dbIsSetup) {
		return
	}
	dbIsSetup = true
	const schema = `
	CREATE TABLE IF NOT EXISTS "account" (
		"userId" text NOT NULL,
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
	ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId" PRIMARY KEY("provider","providerAccountId");
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "session" (
		"sessionToken" text PRIMARY KEY NOT NULL,
		"userId" text NOT NULL,
		"expires" timestamp NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "settings" (
		"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
		"settings" json NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "user" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" text NOT NULL,
		"key" text NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "verificationToken" (
		"identifier" text NOT NULL,
		"token" text NOT NULL,
		"expires" timestamp NOT NULL
	);
	--> statement-breakpoint
	ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token" PRIMARY KEY("identifier","token");
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
`
	await new Promise<void>(resolve => {
		pool.query(schema, err => {
			if (err) {
				throw err
			}
			resolve()
		})
	})
}
