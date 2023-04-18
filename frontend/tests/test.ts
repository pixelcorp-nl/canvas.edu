import { expect, test } from '@playwright/test'

test('Check page is rendered', async ({ page }) => {
	page.goto('/')
	const html = await page.locator('#footer').innerHTML()
	expect(html).toContain('Oswin')
})
