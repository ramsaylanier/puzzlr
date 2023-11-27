<script lang="ts">
	import { determineImagePositionsOnWindowMove } from '$lib/windowUtil.js';
	import { onMount } from 'svelte';

	export let data;

	let naturalWidth: number, naturalHeight: number;
	let otherNaturalWidth: number, otherNaturalHeight: number;
	let image: HTMLImageElement;
	let otherImage: HTMLImageElement;
	$: w = 0;
	$: h = 0;
	$: otherW = 0;
	$: otherH = 0;
	$: otherImagePosition = { x: null, y: null } as { x: number | null; y: number | null };
	$: collided = false;
	$: imageSrc = data.img === 'hammer' ? 'hammer' : collided ? 'broken-egg' : 'egg';
	$: otherImageSrc = data.img === 'hammer' ? (collided ? 'broken-egg' : 'egg') : 'hammer';

	function setImageOffet() {
		if (image) {
			window.localStorage.setItem(
				`${data.img}BoundingBox`,
				JSON.stringify(image.getBoundingClientRect())
			);
		}
	}

	function checkCollision() {
		console.log('check');
		const imageBox = image.getBoundingClientRect();
		const otherBox = otherImage.getBoundingClientRect();

		console.log({ imageBox, otherBox });

		if (data.img === 'hammer') {
			if (imageBox.x < otherBox.x + otherBox.width && imageBox.y < otherBox.y + otherBox.height) {
				collided = true;
			} else {
				collided = false;
			}
		} else {
			if (imageBox.x + imageBox.width > otherBox.x) {
				console.log('collided');
				collided = true;
			} else {
				collided = false;
			}
		}
	}

	function resizeImageToWindow() {
		const maxImageWidth = window.innerWidth / 4;

		w = naturalWidth;
		h = naturalHeight;

		console.log({ naturalHeight, naturalWidth });

		if (naturalWidth >= maxImageWidth) {
			let aspectRatio;

			if (w > h) {
				aspectRatio = w / h;
				w = maxImageWidth;
				h = w / aspectRatio;
			} else {
				aspectRatio = h / w;
				w = maxImageWidth;
				h = w * aspectRatio;
			}
		}
	}

	onMount(() => {
		resizeImageToWindow();
		otherImagePosition = determineImagePositionsOnWindowMove(data.img);

		window.onresize = () => {
			setImageOffet();
			checkCollision();
		};

		window.addEventListener('storage', () => {
			setImageOffet();
			const maxImageWidth = window.innerWidth / 4;
			otherImagePosition = determineImagePositionsOnWindowMove(data.img);

			otherW = otherNaturalWidth;
			otherH = otherNaturalHeight;

			if (otherNaturalWidth >= maxImageWidth) {
				let aspectRatio;

				if (otherW > otherH) {
					aspectRatio = otherW / otherH;
					otherW = maxImageWidth;
					otherH = otherW / aspectRatio;
				} else {
					aspectRatio = otherH / otherW;
					otherW = maxImageWidth;
					otherH = otherW * aspectRatio;
				}
			}

			checkCollision();
		});
	});
</script>

<div class="container">
	<img
		src="/{imageSrc}.png"
		class="image main"
		alt={`${data.img} image`}
		style:width={`${w.toString()}px`}
		style:height={`${h.toString()}px`}
		bind:this={image}
		bind:naturalWidth
		bind:naturalHeight
	/>

	{#if otherImagePosition.x !== null}
		<img
			src="/{otherImageSrc}.png"
			class="image other"
			alt={`${data.img} image`}
			style:transform={`translate(${otherImagePosition.x}px,
		${otherImagePosition.y}px)`}
			style:width={`${otherW.toString()}px`}
			style:height={`${otherH.toString()}px`}
			bind:this={otherImage}
			bind:naturalWidth={otherNaturalWidth}
			bind:naturalHeight={otherNaturalHeight}
		/>
	{/if}
</div>

<style>
	.container {
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image.other {
		position: fixed;
		left: 0;
		top: 0;
	}
</style>
