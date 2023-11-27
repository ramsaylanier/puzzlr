import { writable } from 'svelte/store';

const createStore = () => {
	const { subscribe, set, update } = writable<Window[]>([]);

	const addWindow = (window: Window) => {
		return update((s) => {
			s.push(window);
			return s;
		});
	};

	return {
		subscribe,
		update,
		set,
		addWindow
	};
};

const store = createStore();
export default store;
