import { expect, test, type Page } from '@playwright/test'
import { randomBytes } from 'crypto'

test.describe.configure({ timeout: 20000 })

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
		const text = await resp.text()
		console.log(text)
		return text
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

function randomPixel(): Pixel {
	return {
		x: Math.floor(Math.random() * 200),
		y: Math.floor(Math.random() * 200),
		color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
		key: 'joppe'
	}
}

test('Can put pixel', async () => {
	const pixel = randomPixel()
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

test('Check pixel can be put and then changed', async ({ page }) => {
	const userName: Pixel['key'] = 'joppe'
	await page.goto(`${root}/login`)
	await page.waitForSelector('button[type="submit"]')

	await page.waitForTimeout(1000)
	await page.waitForSelector('input[name="username"]')
	await page.locator('input[name="username"]').first().fill(userName)

	await page.waitForTimeout(1000)
	await page.click('button[type="submit"]')
	await page.waitForTimeout(1000)
	await expect(page.locator('#header-username')).toHaveText(userName)
	await page.goto(`${root}/info`)
	await expect(page.locator('#footer')).toContainText('Oswin, Mees & Joppe')

	// making sure that the canvas scaling factor is 1
	await page.setViewportSize({ width: 200, height: 200 })
	await page.goto(`${root}/canvas`)
	await page.waitForSelector('.canvas-loaded')

	const pixel: Pixel = randomPixel()
	await putPixel(pixel)
	await page.waitForTimeout(1000)
	await assertPixel(page, pixel)

	const newPixel: Pixel = { ...pixel, color: [100, 100, 100] }
	await putPixel(newPixel)
	await page.waitForTimeout(1000)
	await assertPixel(page, newPixel)
})
