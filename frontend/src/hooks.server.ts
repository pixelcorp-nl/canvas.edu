import type { Server } from 'socket.io'

export const handleWs = (io: Server) => {
	io.on('connection', client => {
		console.log('client connected')

		client.on('clientToServer', data => {
			console.log('clientToServer', data)
		})
		client.emit('serverToClient:', 'message from server to client')
		client.send('hello')
	})
}
