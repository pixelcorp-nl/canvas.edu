import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true,
		}),
	],

	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$utils: './src/lib/utils',
			$api: './src/routes/api',
			$lib: './src/lib',
		},
	},
}

export default config;
