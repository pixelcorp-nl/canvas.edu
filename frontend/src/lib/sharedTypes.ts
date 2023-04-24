export type Pixel = {
	x: number
	y: number
	rgba: string
}

export type SocketIOMessages = {
	pixel: {
		key: 'pixel'
		message: Pixel
	}
	pixels: {
		key: 'pixels'
		message: Pixel[]
	}
}

export type Messages = SocketIOMessages[keyof SocketIOMessages]
export type MessageKeys = Messages['key']
