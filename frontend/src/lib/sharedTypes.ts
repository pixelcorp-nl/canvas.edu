import type { Socket as LibSocket } from 'socket.io-client'
import type { Server as LibServer } from 'socket.io'

export type Brand<T, U> = T & { __brand: U }
export type Coordinate = `${number},${number}` // 'x,y' - e.g. 'foo,420,69'
export type RGB = `${number},${number},${number}` // 'r,g,b' - e.g. '255,0,0'
export type PixelMap = Record<Coordinate, RGB>

// https://socket.io/docs/v4/typescript/
export type ServerToClientEvents = {
	pixelMap: (pixelMap: PixelMap) => void
	listenerCount: (count: number) => void
}

export type ClientToServerEvents = {
	none: () => void // This is a placeholder, can be removed once a custom event is added
}

export type Socket = LibSocket<ServerToClientEvents, ClientToServerEvents>
export type Server = LibServer<ClientToServerEvents, ServerToClientEvents>
