import { pool } from '$lib/server/db'

let dbIsSetup = false
export async function setupDBSingleton() {
	if (dbIsSetup) {
		return
	}
	dbIsSetup = true
	const schema = `
	CREATE TABLE IF NOT EXISTS "users" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" text NOT NULL,
		"key" text NOT NULL
	);
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
