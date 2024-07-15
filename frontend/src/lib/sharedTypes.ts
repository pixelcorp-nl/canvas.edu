import type { Socket as LibSocket } from 'socket.io-client'
import type { Server as LibServer } from 'socket.io'

export type Brand<T, U> = T & { __brand: U }
export type Coordinate = Brand<string, 'Coordinate'>
export type RGBA = Brand<string, 'RGBA'>
export type PixelMap = Record<Coordinate, RGBA>

// https://socket.io/docs/v4/typescript/
export type ServerToClientEvents = {
	pixelMap: (pixelMap: PixelMap) => void
	listenerCount: (count: number) => void
}

export type ClientToServerEvents = {
	none: () => void // This is a placeholder, can be removed once a custom event is added
}

export type Socket = LibSocket<ServerToClientEvents, ServerToClientEvents>
export type Server = LibServer<ClientToServerEvents, ServerToClientEvents>

// All custom elements should have at least one - in them, that's why we prefix it with md-, also to prevent name collisions
export type CustomHtmlElements = 'md-exercise' | 'md-codeblock'
