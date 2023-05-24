import preprocess from 'svelte-preprocess'
import adapter from '@carlosv2/adapter-node-ws/adapter'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$util: './src/util',
			$api: './src/routes/api',
			$lib: './src/lib'
		},
		csrf: {
			checkOrigin: false
		}
	}
}

export default config
