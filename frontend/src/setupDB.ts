export const schema = `
	CREATE TABLE IF NOT EXISTS "class_users" (
		"class_id" text NOT NULL,
		"user_id" varchar(15) NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "classes" (
		"id" text PRIMARY KEY NOT NULL,
		"key" text NOT NULL,
		"name" text NOT NULL,
		CONSTRAINT "classes_key_unique" UNIQUE("key")
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "auth_key" (
		"id" varchar(255) PRIMARY KEY NOT NULL,
		"user_id" varchar(15) NOT NULL,
		"primary_key" boolean NOT NULL,
		"hashed_password" varchar(255),
		"expires" bigint
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "auth_session" (
		"id" varchar(128) PRIMARY KEY NOT NULL,
		"user_id" varchar(15) NOT NULL,
		"active_expires" bigint NOT NULL,
		"idle_expires" bigint NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "settings" (
		"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
		"settings" json NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "auth_user" (
		"id" varchar(15) PRIMARY KEY NOT NULL,
		"username" text NOT NULL,
		"apikey" text NOT NULL
	);
	--> statement-breakpoint
	CREATE TABLE IF NOT EXISTS "user_roles" (
		"user_id" varchar(15) NOT NULL,
		"role" text NOT NULL
	);
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "class_users" ADD CONSTRAINT "class_users_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "class_users" ADD CONSTRAINT "class_users_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
	--> statement-breakpoint
	DO $$ BEGIN
	 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION
	 WHEN duplicate_object THEN null;
	END $$;
` as const
