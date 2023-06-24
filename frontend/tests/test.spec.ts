import { expect, test, type Page } from '@playwright/test'

type Pixel = {
	x: number
	y: number
	color: [number, number, number, number]
	key: 'joppe'
}

async function putPixel(pixel: Pixel): Promise<Record<string, unknown>> {
	try {
		const resp = await fetch('http://localhost:5173/api/single', {
			method: 'POST',
			body: JSON.stringify(pixel)
		})
		return resp?.json()
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
		color: [data?.data[0], data?.data[1], data?.data[2], data?.data[3]] as [number, number, number, number],
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

test('Check page is rendered', async ({ page }) => {
	await page.goto('http://localhost:5173')
	const html = await page.locator('#footer').innerHTML()
	expect(html).toContain('Oswin')
})

test('Can put pixel', async () => {
	const pixel: Pixel = { x: 0, y: 0, color: [42, 42, 42, 255], key: 'joppe' }
	expect((await putPixel(pixel))?.['success']).toBe(true)
})

test('Cannot put invalid pixel', async () => {
	const pixel: Pixel = { x: -1, y: 0, color: [42, 42, 42, 255], key: 'joppe' }
	expect((await putPixel(pixel))?.['success']).toBe(false)
})

test('Check pixel can be put and then changed', async ({ page }) => {
	await page.goto('http://localhost:5173')
	await page.waitForTimeout(1000) // Wait for canvas to draw

	const pixel: Pixel = { x: 0, y: 0, color: [50, 50, 50, 255], key: 'joppe' }
	await putPixel(pixel)
	await page.waitForTimeout(1000)
	await assertPixel(page, pixel)

	const newPixel: Pixel = { ...pixel, color: [100, 100, 100, 255] }
	await putPixel(newPixel)
	await page.waitForTimeout(1000)
	await assertPixel(page, newPixel)
})
