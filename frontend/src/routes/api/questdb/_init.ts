const pixel_table = `
CREATE TABLE IF NOT EXISTS pixel_data (
  timestamp timestamp,
  canvasId INT,
  x INT,
  y INT,
  red INT,
  green INT,
  blue INT,
  alpha INT
) timestamp(timestamp) PARTITION BY WEEK;
`

export async function initQDB() {
	const check = await fetch('http://localhost:9000/exec?query=SELECT%20*%20FROM%20pixel_data')
	if (check.ok) {
		console.log('initQDB', 'pixel_data table already exists')
		return null
	}
	try {
		const resExists = await fetch(`http://localhost:9000/exec?query=${encodeURIComponent(pixel_table)}`)
		if (!resExists.ok) {
			console.log('initQDB', resExists)
		}
		const jsonExists = await resExists.json()
		console.log('initQDB', jsonExists)
	} catch (error) {
		console.error('Error during initialization:', error)
	}
	await initQDBSocket().catch(console.error)
}

const socket_table = `
CREATE TABLE IF NOT EXISTS socket_data (
	timestamp timestamp,
	canvasId INT,
	id STRING,
	type STRING,
	ip STRING,
	metadata STRING
	) timestamp(timestamp) PARTITION BY DAY;
`

export async function initQDBSocket() {
	try {
		const resExists = await fetch(`http://localhost:9000/exec?query=${encodeURIComponent(socket_table)}`)
		if (!resExists.ok) {
			console.log('initQDBSocket', resExists)
		}
		const jsonExists = await resExists.json()
		console.log('initQDBSocket', jsonExists)
	} catch (error) {
		console.error('Error during initialization:', error)
	}
}
