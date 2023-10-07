import { expect, test, type Page } from '@playwright/test'
import { randomBytes } from 'crypto'

test.describe.configure({ mode: 'parallel', timeout: 10_000 })

// const root = 'https://pixels.joppekoers.nl'
const root = 'http://localhost:5173'

async function signup(page: Page, userName: string) {
	await page.goto(`${root}/signup`)
	await page.waitForSelector('button[type="submit"]')

	await page.waitForSelector('input[name="username"]')
	await page.locator('input[name="username"]').fill(userName)

	await page.click('button[type="submit"]')
	await expect(page.locator('#header-username')).toHaveText(userName)
	await page.goto(`${root}/info`)
	await expect(page.locator('#footer')).toContainText('Oswin, Mees & Joppe')
	await page.goto(`${root}/canvas`)
	await page.waitForSelector('.canvas-loaded')
}

function signupRand(page: Page) {
	return signup(page, `joppe-loadtest-${randomBytes(10).toString('hex')}`)
}

for (let i = 0; i < 100; i++) {
	test(`Load ${i}`, ({ page }) => signupRand(page))
}
