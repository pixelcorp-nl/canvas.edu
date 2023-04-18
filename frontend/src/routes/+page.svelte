<script lang="ts">
	import { onMount } from 'svelte'
	import io from 'socket.io-client'

	let scaled = false
	let canvas: HTMLCanvasElement
	let onCanvasX = 0
	let onCanvasY = 0

	const bytesPerColor = 4
	let pScalar: number
	let canvasHeight: number
	let canvasWidth: number

	type Pixel = {
		x: number
		y: number
		data: [number, number, number, number]
	}

	type Event = {
		clientX: number
		clientY: number
	}
	onMount(() => {
		const configData = {
			api: 'http://api.pixels.codam.nl',
			pixelScalar: 8,
			canvasWidth: 100,
			canvasHeight: 100,
			timeout: 1000,
			pictureInterval: 60,
			replayTimeout: 420,
			replayPxlCount: 42
		}
		pScalar = configData.pixelScalar
		canvasHeight = configData.canvasHeight
		canvasWidth = configData.canvasWidth

		const socket = io(`${configData.api}/canvas`)
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D // TODO: Error handling
		ctx.imageSmoothingEnabled = false

		/**
		 * Increase the size of the array to 64.
		 * @param inputArray The array to increase.
		 */
		function increaseArraySize(inputArray: Uint8ClampedArray) {
			const outputArray = new Uint8ClampedArray(64)
			for (let i = 0; i < pScalar ** 2 * bytesPerColor; i++) {
				// @ts-ignore
				outputArray[i] = inputArray[i % 4]
			}
			return outputArray
		}

		// Someone else updated the pixel
		socket.on('update', pixel => {
			// console.log("update");
			const tmpData = increaseArraySize(new Uint8ClampedArray(pixel.data))
			ctx.putImageData(new ImageData(tmpData, pScalar, pScalar), pixel.x * pScalar, pixel.y * pScalar)
		})

		socket.on('multiple-update', (pixels: Pixel[]) => {
			pixels.forEach(p => {
				const tmpData = increaseArraySize(new Uint8ClampedArray(p.data))
				ctx.putImageData(new ImageData(tmpData, 4, 4), p.x * 4, p.y * 4)
			})
		})

		// We just connected, and we get the canvas data
		socket.on('init', canvas => {
			const imageData = new ImageData(new Uint8ClampedArray(canvas.data), canvas.width, canvas.height)

			// Absolutely disgusting hack to get the image data to the canvas
			const tmpCanvas = document.createElement('canvas')
			tmpCanvas.width = pScalar * configData.canvasWidth
			tmpCanvas.height = pScalar * configData.canvasHeight

			const tmpctx = tmpCanvas.getContext('2d') as CanvasRenderingContext2D // TODO: Error handling
			ctx.imageSmoothingEnabled = false
			if (scaled === false) {
				scaled = true
				ctx.scale(pScalar, pScalar)
			}

			tmpctx.putImageData(imageData, 0, 0)
			ctx.imageSmoothingEnabled = false
			ctx.drawImage(tmpctx.canvas, 0, 0)
		})
	})

	function logPosition(event: Event) {
		const rect = canvas.getBoundingClientRect()
		const x = Math.floor((event.clientX - rect.left) / pScalar) - 1
		const y = Math.floor((event.clientY - rect.top) / pScalar) - 1
		if (x < 0 || y < 0) {
			return
		}
		onCanvasX = x
		onCanvasY = y
	}
</script>

<svelte:head>
	<title>Codam - Canvas Project</title>
	<meta name="description" content="pixel-canvas" />
</svelte:head>

<section>
	<canvas width={canvasWidth * pScalar} height={canvasHeight * pScalar} bind:this={canvas} on:mousemove={logPosition} />
</section>

<p class="text-center mt-5 font-mono">x: {onCanvasX}, y: {onCanvasY}</p>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	canvas {
		border: 2px solid rgb(226, 226, 226);
		border-radius: 6px;
		background-color: rgb(245, 245, 245);
	}
</style>
