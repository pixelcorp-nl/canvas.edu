import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	use: {
		video: 'retain-on-failure',
		trace: 'retain-on-failure'
	}
}

export default config
