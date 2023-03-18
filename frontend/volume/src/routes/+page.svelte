<script lang="ts">
import { onMount } from "svelte";
import io from 'socket.io-client';

let scaled = false;
let canvas: HTMLCanvasElement;
let onCanvasX: number = 0;
let onCanvasY: number = 0;

const bytesPerColor = 4;
let pScalar: number;
let canvasHeight: number;
let canvasWidth: number;

onMount(async () => {
	const response = await fetch('/src/config-linked.json');
	const configData = await response.json();
	pScalar = configData.pixelScalar;
	canvasHeight = configData.canvasHeight;
	canvasWidth = configData.canvasWidth;

	const socket = io(configData.api + '/canvas');
	const ctx = canvas.getContext("2d")!; // TODO: Error handling
	ctx.imageSmoothingEnabled = false;

	/**
	 * Increase the size of the array to 64.
	 * @param inputArray The array to increase.
	 */
	function increaseArraySize(inputArray: Uint8ClampedArray) {
		const outputArray = new Uint8ClampedArray(64);
		for (let i = 0; i < (pScalar ** 2) * bytesPerColor; i++)
			outputArray[i] = inputArray[i % 4];
		return outputArray;
	}

	// Someone else updated the pixel
	socket.on('update', pixel => {
        let tmpData = increaseArraySize(new Uint8ClampedArray(pixel.data));
        ctx.putImageData(new ImageData(tmpData, pScalar, pScalar), pixel.x * pScalar, pixel.y * pScalar);
	});

		socket.on('multiple-update', pixel => {
		pixel.forEach((p: any) => {
			let tmpData = increaseArraySize(new Uint8ClampedArray(p.data));
			ctx.putImageData(new ImageData(tmpData, 4, 4), p.x * 4, p.y * 4);
		});
	});

	// We just connected, and we get the canvas data
	socket.on('init', canvas => {
		console.log("init event");
		const imageData = new ImageData(new Uint8ClampedArray(canvas.data), canvas.width, canvas.height);

		// Absolutely disgusting hack to get the image data to the canvas
		const tmpCanvas = document.createElement('canvas');
		const tmpctx = tmpCanvas.getContext('2d')!;
		ctx.imageSmoothingEnabled = false;
		if (scaled == false)	{
			scaled = true;
			ctx.scale(pScalar, pScalar);
		}
		tmpCanvas.width = pScalar * configData.canvasWidth;
		tmpCanvas.height = pScalar * configData.canvasHeight;

		tmpctx.putImageData(imageData, 0, 0);
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(tmpctx.canvas, 0, 0);
	});

});

function logPosition(event: any)	{
	const rect = canvas.getBoundingClientRect();
	const x = Math.floor((event.clientX - rect.left) / pScalar) - 1;
  const y = Math.floor((event.clientY - rect.top) / pScalar) - 1;
	if (x < 0 || y < 0)
		return ;
	onCanvasX = x;
	onCanvasY = y;
}

</script>

<svelte:head>
	<title>Codam - Canvas Project</title>
	<meta name="description" content="pixel-canvas" />
</svelte:head>

<section>
	<canvas width={canvasWidth * pScalar} height={canvasHeight * pScalar} bind:this={canvas} on:mousemove={logPosition}></canvas>
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
