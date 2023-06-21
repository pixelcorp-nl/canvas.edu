<script lang="ts">
	import { io } from 'socket.io-client'
	import { publicEnv } from '../../publicEnv'
	import type { Socket } from '$lib/sharedTypes'
	import { onDestroy, onMount } from 'svelte'
	import { PixelObj, forEachPixel } from '$api/_pixelUtils'

	const { canvasHeight, canvasWidth, pScalar } = publicEnv
	let xMouse = 0
	let yMouse = 0

	let canvas: HTMLCanvasElement

	const socket: Socket = io()
	onMount(() => {
		socket.on('pixelMap', pixelMap => {
			forEachPixel(pixelMap, pixel => {
				drawPixelOnCanvas(pixel, pScalar)
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

	function drawPixelOnCanvas(pixelObj: PixelObj, pixelSize: number): void {
		const { x, y, color } = pixelObj
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
		ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
	}

	function logPosition(event: MouseEvent) {
		// calculate the actual position in the origional canvas by dividing the offset by the scalar
		xMouse = Math.floor(event.offsetX / pScalar)
		yMouse = Math.floor(event.offsetY / pScalar)
	}
</script>

<section>
	<canvas bind:this={canvas} width={canvasWidth * pScalar} height={canvasHeight * pScalar} on:mousemove={logPosition} id="canvas" />
	<p class="mt-5">
		{xMouse}, {yMouse}
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
