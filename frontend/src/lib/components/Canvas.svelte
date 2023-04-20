<script lang="ts">
	import { PUBLIC_CANVAS_HEIGHT, PUBLIC_CANVAS_WIDTH, PUBLIC_SCALAR } from '$env/static/public'
	import { onMount } from 'svelte'
	const canvasWidth = Number(PUBLIC_CANVAS_WIDTH)
	const canvasHeight = Number(PUBLIC_CANVAS_HEIGHT)
	const pScalar = parseFloat(PUBLIC_SCALAR) || 1

	let { X, Y } = { X: 0, Y: 0 }

	let canvas: HTMLCanvasElement

	onMount(async () => {
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

	function drawObjectOnCanvas(colorData: Record<string, string>, canvas: HTMLCanvasElement, pixelSize: number): void {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		const animationDuration = 1000 // Duration in milliseconds
		const startTime = performance.now()

		const draw = (timestamp: number) => {
			const elapsedTime = timestamp - startTime
			const progress = Math.min(elapsedTime / animationDuration, 1)

			ctx.clearRect(0, 0, canvas.width, canvas.height)

			for (const key in colorData) {
				const [x, y] = key.split(',').map(Number) as [number, number]
				const color = colorData[key] as keyof typeof colorData

				ctx.fillStyle = changeColorOpacity(color, progress)
				ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
			}

			if (progress < 1) {
				window.requestAnimationFrame(draw)
			}
		}

		window.requestAnimationFrame(draw)
	}

	function changeColorOpacity(color: string, opacity: number): string {
		const rgba = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i.exec(color)
		if (rgba) {
			const r = parseInt(rgba[1] as string)
			const g = parseInt(rgba[2] as string)
			const b = parseInt(rgba[3] as string)
			return `rgba(${r},${g},${b},${opacity})`
		}

		const hex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
		if (hex) {
			const r = parseInt(hex[1] as string, 16)
			const g = parseInt(hex[2] as string, 16)
			const b = parseInt(hex[3] as string, 16)
			return `rgba(${r},${g},${b},${opacity})`
		}

		return `rgba(0, 0, 0, ${opacity})`
	}

	function logPosition(event: MouseEvent) {
		// calculate the actual position in the origional canvas by dividing the offset by the scalar
		X = Math.floor(event.offsetX / pScalar)
		Y = Math.floor(event.offsetY / pScalar)
	}
</script>

<section>
	<canvas bind:this={canvas} width={canvasWidth * pScalar} height={canvasHeight * pScalar} on:mousemove={logPosition} />
	<p class="mt-5">
		{X}, {Y}
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
