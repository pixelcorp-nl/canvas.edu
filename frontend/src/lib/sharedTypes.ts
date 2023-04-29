import type { Socket as LibSocket } from 'socket.io-client'
import type { Server as LibServer } from 'socket.io'

export type Pixel = {
	x: number
	y: number
	rgba: string
}

// https://socket.io/docs/v4/typescript/
export type ServerToClientEvents = {
	pixels: (pixels: Pixel[]) => void
}

export type ClientToServerEvents = {
	none: () => void // This is a placeholder, can be removed once a custom event is added
}

export type Socket = LibSocket<ServerToClientEvents, ServerToClientEvents>
export type Server = LibServer<ClientToServerEvents, ServerToClientEvents>
