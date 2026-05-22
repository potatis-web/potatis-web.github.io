import { writable } from 'svelte/store';

function createThemeStore() {
	const { subscribe, set } = writable(false);

	return {
		subscribe,
		toggle: () => {
			set((isDark) => {
				const newValue = !isDark;
				localStorage.setItem('dark', newValue);
				if (newValue) {
					document.body.classList.add('dark');
				} else {
					document.body.classList.remove('dark');
				}
				return newValue;
			});
		},
		set: (value) => {
			localStorage.setItem('dark', value);
			if (value) {
				document.body.classList.add('dark');
			} else {
				document.body.classList.remove('dark');
			}
			set(value);
		},
	};
}

export const isDarkMode = createThemeStore();
