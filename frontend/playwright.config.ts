import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	use: {
		video: 'on-first-retry'
	}
}

export default config
