<script lang="ts">
	import { io } from 'socket.io-client'
	import { publicEnv } from '../../publicEnv'
	import type { Socket } from '$lib/sharedTypes'
	import { onDestroy, onMount } from 'svelte'
	import { PixelObj, forEachPixel } from '$api/_pixelUtils'

	let xMouse = 0
	let yMouse = 0

	let canvas: HTMLCanvasElement
	let pScalar = 0
	let sectionWidth = 0
	let sectionHeight = 0

	const socket: Socket = io()
	onMount(() => {
		const size = Math.min(sectionWidth, sectionHeight)
		pScalar = Math.floor(size / publicEnv.canvasWidth) || 1
		const canvasSize = publicEnv.canvasWidth * pScalar
		canvas.width = canvasSize
		canvas.height = canvasSize

		socket.on('pixelMap', pixelMap => {
			forEachPixel(pixelMap, drawPixelOnCanvas)
			canvas.classList.add('canvas-loaded')
		})
	})

	onDestroy(() => {
		socket.disconnect()
	})

	function drawPixelOnCanvas(pixelObj: PixelObj): void {
		const { x, y, color } = pixelObj
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`

		const pixelSize = Math.round(pScalar)
		ctx.fillRect(Math.round(x * pScalar), Math.round(y * pScalar), pixelSize, pixelSize)
	}

	function logPosition(event: MouseEvent) {
		// calculate the actual position in the original canvas by dividing the offset by the scalar
		xMouse = Math.floor(event.offsetX / pScalar)
		yMouse = Math.floor(event.offsetY / pScalar)
		if (xMouse < 0 || yMouse < 0 || xMouse >= publicEnv.canvasWidth || yMouse >= publicEnv.canvasWidth) {
			xMouse = 0
			yMouse = 0
		}
	}
</script>

<section bind:clientWidth={sectionWidth} bind:clientHeight={sectionHeight}>
	<canvas bind:this={canvas} width={0} height={0} on:mousemove={logPosition} on:mouseleave={logPosition} id="canvas" />
	<pre>x = {xMouse.toString().padStart(3)}, y = {yMouse.toString().padStart(3)}</pre>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex: 1;

		position: relative;
		left: 50%;
		transform: translateX(-50%);
		width: 95vw;
		min-height: 98vh;
	}

	canvas {
		border: 2px solid rgb(226, 226, 226);
		border-radius: 6px;
		background-color: rgb(245, 245, 245);
	}
</style>
