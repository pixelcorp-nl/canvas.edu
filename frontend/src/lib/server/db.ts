import postgres from 'pg'
import { privateEnv } from '../../privateEnv'

export const pool = new postgres.Pool({
	connectionString: privateEnv.postgresUrl
})
