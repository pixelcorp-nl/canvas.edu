import { expect, test, type Page } from '@playwright/test'
import { randomBytes } from 'crypto'

test.describe.configure({ mode: 'parallel', timeout: 5000 })

const root = 'http://localhost:5173'
async function signup(page: Page, userName: string) {
	await page.goto(`${root}/signup`)
	await page.waitForSelector('button[type="submit"]')

	await page.evaluate(userName => {
		;(document.querySelector('input[name="username"]') as HTMLInputElement).value = userName
		try {
			;(document.querySelector('#password') as HTMLInputElement).value = userName
			;(document.querySelector('#password-confirm') as HTMLInputElement).value = userName
		} catch (e) {
			/**/
		}
		;(document.querySelector('button[type="submit"]') as HTMLButtonElement).click()
	}, userName)
	await expect(page.locator('#header-username')).toHaveText(userName)
}

function signupRand(page: Page) {
	return signup(page, `joppe-loadtest-${randomBytes(10).toString('hex')}`)
}

for (let i = 0; i < 100; i++) {
	test(`Load ${i}`, ({ page }) => signupRand(page))
}
