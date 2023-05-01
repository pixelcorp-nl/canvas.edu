import { expect, test, type Page } from '@playwright/test'

type Pixel = {
	x: number
	y: number
	color: [number, number, number, number]
}

async function putPixel(pixel: Pixel): Promise<Record<string, unknown>> {
	const resp = await fetch('http://localhost:5173/api/single', {
		method: 'POST',
		body: JSON.stringify(pixel)
	})
	const json = await resp?.json()
	return json
}

async function getPixel(page: Page, x: number, y: number): Promise<Pixel> {
	const data = await page.evaluate(() => {
		const canvas = document.querySelector('canvas')
		const ctx = canvas?.getContext('2d')
		return ctx?.getImageData(2, 2, 1, 1)
	})

	const pixel: Pixel = {
		x,
		y,
		color: [data?.data[0], data?.data[1], data?.data[2], data?.data[3]] as [number, number, number, number]
	}
	if (pixel.color.some(c => c === undefined)) {
		throw new Error('Pixel color is undefined')
	}
	return pixel
}

async function assertPixel(page: Page, pixel: Pixel) {
	await expect(page.locator('#canvas')).toBeVisible()

	await page.waitForTimeout(2000) // Wait for canvas to draw

	const canvasPixel = await getPixel(page, pixel.x, pixel.y)
	expect(canvasPixel).toStrictEqual(pixel)
}

test('Check page is rendered', async ({ page }) => {
	await page.goto('http://localhost:5173')
	const html = await page.locator('#footer').innerHTML()
	expect(html).toContain('Oswin')
})

test('Check pixel can be put and then changed', async ({ page }) => {
	await page.goto('http://localhost:5173')

	const pixel: Pixel = { x: 0, y: 0, color: [50, 50, 50, 255] }
	expect(await putPixel(pixel)).toStrictEqual({ ...pixel, message: 'Request added to batch' })
	await page.waitForTimeout(2000) // Wait for canvas to draw
	await assertPixel(page, pixel)

	const newPixel: Pixel = { ...pixel, color: [100, 100, 100, 255] }
	await putPixel(newPixel)
	await page.waitForTimeout(2000) // Wait for canvas to draw
	await assertPixel(page, newPixel)
})
