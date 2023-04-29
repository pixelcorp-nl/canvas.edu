<script lang="ts">
	import { io } from 'socket.io-client'
	import type { Socket } from '$lib/sharedTypes'
	import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH, PUBLIC_SCALAR } from '$env/static/public'
	import { onMount } from 'svelte'

	const canvasWidth = Number(PUBLIC_CANVAS_WIDTH)
	const canvasHeight = Number(PUBLIC_CANVAS_HEIGHT)
	const pScalar = parseFloat(PUBLIC_SCALAR) || 1

	let { x, y } = { x: 0, y: 0 }

	let canvas: HTMLCanvasElement

	onMount(async () => {
		const socket: Socket = io()
		socket.on('pixels', pixels => {
			for (const { x, y, rgba } of pixels) {
				drawPixelOnCanvas(x, y, rgba, pScalar)
			}
		})

		const data = (await fetch('/api/canvas').then(res => res.json())) as Record<string, string>

		// console.log(await data);
		const { canvasSize, pixelSize } = calculateNewCanvasSize(pScalar, canvasWidth, canvasHeight)
		canvas.width = canvasSize.width
		canvas.height = canvasSize.height
		drawObjectOnCanvas(data, canvas, pixelSize)
	})

	function calculateNewCanvasSize(scalingFactor: number, canvasWidth: number, canvasHeight: number) {
		const newCanvasWidth = Math.round(canvasWidth * scalingFactor)
		const newCanvasHeight = Math.round(canvasHeight * scalingFactor)
		const pixelSize = scalingFactor

		return {
			canvasSize: { width: newCanvasWidth, height: newCanvasHeight },
			pixelSize
		}
	}

	function drawPixelOnCanvas(x: number, y: number, color: string, pixelSize: number): void {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.fillStyle = `rgba(${color})`
		ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
	}

	function drawObjectOnCanvas(colorData: Record<string, string>, canvas: HTMLCanvasElement, pixelSize: number): void {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		for (const key in colorData) {
			const [x, y] = key.split(',').map(Number) as [number, number]
			const color = colorData[key] as keyof typeof colorData

			drawPixelOnCanvas(x, y, color, pixelSize)
		}
	}

	function logPosition(event: MouseEvent) {
		// calculate the actual position in the origional canvas by dividing the offset by the scalar
		x = Math.floor(event.offsetX / pScalar)
		y = Math.floor(event.offsetY / pScalar)
	}
</script>

<section>
	<canvas bind:this={canvas} width={canvasWidth * pScalar} height={canvasHeight * pScalar} on:mousemove={logPosition} />
	<p class="mt-5">
		{x}, {y}
	</p>
</section>

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
