import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import WebSockets from '@carlosv2/adapter-node-ws/plugin'

export default defineConfig({
	plugins: [sveltekit(), WebSockets()],
	server: {
		port: 5173,
		hmr: { port: 5174 }
	}
})
