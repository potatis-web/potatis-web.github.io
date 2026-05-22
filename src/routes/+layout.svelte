<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { isDarkMode } from '$lib/stores/theme';

	let { children } = $props();

	onMount(() => {
		const stored = localStorage.getItem('dark');
		const isDark = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
		isDarkMode.set(isDark);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
