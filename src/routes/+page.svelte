<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import store from '../store';

	import { createWindow } from '$lib/windowUtil';

	let windowData = {};

	const handleCLick = () => {
		if (browser) {
			const eggWindow = createWindow($store, 'egg');
			eggWindow && store.addWindow(eggWindow);
			const hammerWindow = createWindow($store, 'hammer');
			hammerWindow && store.addWindow(hammerWindow);
		}
	};

	const tick = () => {
		$store.forEach((w) => {
			console.log({ w });
			const name = w.name;
			let data = windowData[name];
			const shape = {
				x: w.screenLeft,
				y: w.screenTop,
				h: w.outerHeight,
				w: w.outerWidth
			};

			if (
				!data ||
				data.x !== shape.x ||
				data.y !== shape.y ||
				data.h !== shape.h ||
				data.w !== shape.w
			) {
				windowData[name] = shape;
				window.localStorage.setItem(name, JSON.stringify(shape));
			}
		});

		window.requestAnimationFrame(tick);
	};

	onMount(() => {
		tick();

		return () => {
			window.cancelAnimationFrame();
		};
	});
</script>

<div class="container">
	<button on:click={handleCLick} class="button">Start</button>
</div>

<style>
	body {
		margin: 0;
	}

	.container {
		height: 100vh;
		width: 100vw;
		top: 0;
		left: 0;
		position: fixed;
		background: red;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button {
		position: relative;
		z-index: 10;
	}
</style>
