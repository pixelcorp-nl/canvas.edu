import type { PixelMap } from '$lib/sharedTypes'
import { Sender } from '@questdb/nodejs-client'
import { forEachPixel } from '$api/_utils'
import { initQDB } from './_init'

const sender: Sender = new Sender({ bufferSize: 4096 })
let isConnected = false

async function startQDBConnection() {
	if (isConnected) {
		return
	}
	isConnected = await sender.connect({ port: 9009, host: 'localhost' })
	if (isConnected) {
		initQDB()
	}
}

export async function storePixels(pixels: PixelMap, canvasId: string) {
	if (!isConnected) {
		await startQDBConnection()
	}
	forEachPixel(pixels, (x, y, rgba) => {
		const [red, green, blue, alpha] = rgba.split(',').map(Number) as [number, number, number, number]
		sender
			.table('pixel_data')
			.intColumn('canvasId', Number(canvasId))
			.intColumn('x', x)
			.intColumn('y', y)
			.intColumn('red', red)
			.intColumn('green', green)
			.intColumn('blue', blue)
			.intColumn('alpha', alpha)
			.atNow()
	})
	await sender.flush()
}

export async function storeSocketData(canvasId: string, id: string, type: string, ip: string, metadata: string) {
	if (!isConnected) {
		await startQDBConnection()
	}
	sender
		.table('socket_data')
		.intColumn('canvasId', Number(canvasId))
		.stringColumn('id', id)
		.stringColumn('type', type)
		.stringColumn('ip', ip)
		.stringColumn('metadata', metadata)
		.atNow()
	await sender.flush()
}

process.on('SIGTERM', () => {
	if (isConnected) {
		sender.close()
	}
})
