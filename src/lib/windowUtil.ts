import { v4 as uuidv4 } from 'uuid';

export const createWindow = (existingWindows: Window[], name?: string) => {
	const id = name || uuidv4();

	if (name) {
		console.log({ name });
		console.log('window length', existingWindows.length);
		const w = window.screen.availWidth / 2;
		const x = existingWindows.length * w;
		return window.open(
			`http://localhost:5173/window/${id}`,
			id,
			`left=${x},top=0,width=${w},height=${window.outerHeight}`
		);
	} else {
		const imgNum = Math.floor(Math.random() * 4 + 1);
		const w = window.innerWidth / (existingWindows.length + 2);
		const x = existingWindows.length * w;
		return window.open(
			`http://localhost:5173/window/${id}?img=${imgNum}`,
			id,
			`left=${x},top=0,width=${w},height=${window.outerHeight}`
		);
	}
};

export const determineImagePositionsOnWindowMove = (sourceWindowName: string) => {
	const hammerShape = JSON.parse(window.localStorage.getItem('hammer') || '{}');
	const hammerImageBox = JSON.parse(window.localStorage.getItem('hammerBoundingBox') || '{}');
	const eggShape = JSON.parse(window.localStorage.getItem('egg') || '{}');
	const eggImageBox = JSON.parse(window.localStorage.getItem('eggBoundingBox') || '{}');

	if (sourceWindowName === 'hammer') {
		return {
			x: eggShape.x + eggImageBox.x - hammerShape.x,
			y: eggShape.y + eggImageBox.y - hammerShape.y
		};
	} else {
		return {
			x: hammerShape.x + hammerImageBox.x - eggShape.x,
			y: hammerShape.y + hammerImageBox.y - eggShape.y
		};
	}
};
