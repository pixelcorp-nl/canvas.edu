export type SocketIOMessages = {
	pixel: {
		key: 'pixel'
		message: {
			x: number
			y: number
			color: string
		}
	}
}

export type Messages = SocketIOMessages[keyof SocketIOMessages]
export type MessageKeys = Messages['key']
