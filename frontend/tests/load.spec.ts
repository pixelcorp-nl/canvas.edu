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

// For some reason I can't test this in a for loop
test('Load 1', ({ page }) => signupRand(page))
test('Load 2', ({ page }) => signupRand(page))
test('Load 3', ({ page }) => signupRand(page))
test('Load 4', ({ page }) => signupRand(page))
test('Load 5', ({ page }) => signupRand(page))
test('Load 6', ({ page }) => signupRand(page))
test('Load 7', ({ page }) => signupRand(page))
test('Load 8', ({ page }) => signupRand(page))
test('Load 9', ({ page }) => signupRand(page))
test('Load 10', ({ page }) => signupRand(page))
test('Load 11', ({ page }) => signupRand(page))
test('Load 12', ({ page }) => signupRand(page))
test('Load 13', ({ page }) => signupRand(page))
test('Load 14', ({ page }) => signupRand(page))
test('Load 15', ({ page }) => signupRand(page))
test('Load 16', ({ page }) => signupRand(page))
test('Load 17', ({ page }) => signupRand(page))
test('Load 18', ({ page }) => signupRand(page))
test('Load 19', ({ page }) => signupRand(page))
test('Load 20', ({ page }) => signupRand(page))
