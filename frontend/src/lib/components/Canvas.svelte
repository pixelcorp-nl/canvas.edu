<script lang="ts">
	import { io } from 'socket.io-client'
	import { publicEnv } from '../../publicEnv'
	import type { Socket } from '$lib/sharedTypes'
	import { onDestroy, onMount } from 'svelte'
	import { forEachPixel } from '$api/_redis'

	const { canvasHeight, canvasWidth, pScalar } = publicEnv
	let { x, y } = { x: 0, y: 0 }

	let canvas: HTMLCanvasElement

	const socket: Socket = io()
	onMount(() => {
		socket.on('pixelMap', pixelMap => {
			forEachPixel(pixelMap, (x, y, color) => {
				drawPixelOnCanvas(x, y, color, pScalar)
			})
		})

		const { canvasSize } = calculateNewCanvasSize(pScalar, canvasWidth, canvasHeight)
		canvas.width = canvasSize.width
		canvas.height = canvasSize.height
	})

	onDestroy(() => {
		socket.disconnect()
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

	function logPosition(event: MouseEvent) {
		// calculate the actual position in the origional canvas by dividing the offset by the scalar
		x = Math.floor(event.offsetX / pScalar)
		y = Math.floor(event.offsetY / pScalar)
	}
</script>

<section>
	<canvas bind:this={canvas} width={canvasWidth * pScalar} height={canvasHeight * pScalar} on:mousemove={logPosition} id="canvas" />
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
