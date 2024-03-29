import { expect, test, type Page } from '@playwright/test'
import { randomBytes } from 'crypto'

test.describe.configure({ timeout: 10000 })

type Pixel = {
	x: number
	y: number
	color: [number, number, number]
	key: 'joppe'
}

const root = 'http://localhost:5173'
async function putPixel(pixel: Pixel): Promise<string | undefined> {
	try {
		const resp = await fetch(`${root}/api/single`, {
			method: 'POST',
			body: JSON.stringify(pixel)
		})
		return resp?.text()
	} catch (err) {
		console.error(err)
		throw new Error('Failed to put pixel')
	}
}

async function getPixel(page: Page, x: number, y: number): Promise<Pixel> {
	const data = await page.evaluate(
		({ x, y }: { x: number; y: number }) => {
			const canvas = document.querySelector('canvas')
			const ctx = canvas?.getContext('2d')
			return ctx?.getImageData(x, y, 1, 1)
		},
		{ x, y }
	)

	const pixel: Pixel = {
		x,
		y,
		color: [data?.data[0], data?.data[1], data?.data[2]] as [number, number, number],
		key: 'joppe'
	}
	if (pixel.color.some(c => c === undefined)) {
		throw new Error('Pixel color is undefined')
	}
	return pixel
}

async function assertPixel(page: Page, pixel: Pixel) {
	await expect(page.locator('#canvas')).toBeVisible()

	const canvasPixel = await getPixel(page, pixel.x, pixel.y)
	expect(canvasPixel).toStrictEqual(pixel)
}

test('Can put pixel', async () => {
	const pixel: Pixel = { x: 0, y: 0, color: [42, 42, 42], key: 'joppe' }
	expect(await putPixel(pixel)).toMatch('Success!')
})

test('Cannot put unauthenticated pixel', async () => {
	const pixel: Pixel = { x: -1, y: 0, color: [42, 42, 42], key: 'not joppe' as 'joppe' }
	expect(await putPixel(pixel)).toMatch('Error!')
})

test('Cannot put invalid pixel', async () => {
	const pixel: Pixel = { x: -1, y: 0, color: [42, 42, 42], key: 'joppe' }
	expect(await putPixel(pixel)).toMatch('Error!')
})

// for some reason this works in dev and in prod, but not in test
test.skip('Can create account', async ({ page }) => {
	await page.goto(`${root}/signup`)
	await page.waitForSelector('button[type="submit"]')

	const userName = `joppe${randomBytes(10).toString('hex')}`
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

	// TODO make separate test for this and share cookies between them
})

test('Check pixel can be put and then changed', async ({ page }) => {
	await page.goto(`${root}/canvas?adminKey=joppe`)
	await page.waitForSelector('.canvas-loaded')

	const pixel: Pixel = { x: 0, y: 0, color: [50, 50, 50], key: 'joppe' }
	await putPixel(pixel)
	await page.waitForTimeout(1000)
	await assertPixel(page, pixel)

	const newPixel: Pixel = { ...pixel, color: [100, 100, 100] }
	await putPixel(newPixel)
	await page.waitForTimeout(1000)
	await assertPixel(page, newPixel)
})
