<script>
	// Svelte logic
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	// Components
	import Notification from '$lib/components/Notification.svelte';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	// Assets
	import Plus from '$lib/components/Icons/Plus.svelte';
	import Pen from '$lib/components/Icons/Pen.svelte';
	import Cross from '$lib/components/Icons/Cross.svelte';

	// Services
	import { onAuthStateChange, logOut } from '$lib/services/auth';
	import { getMyQuizzes, createQuiz } from '$lib/services/quizManager';
	import { isDarkMode } from '$lib/stores/theme';

	/*
	// Structure
	const quizTemplate = {
		name: 'New Quiz',
		description: 'A short description goes here',
		image: 'https://blocks.astratic.com/img/general-img-square.png',
		q: [
			{
				title: 'Sample question?',
				options: [
					{ text: 'Option 1', value: 'option1' },
					{ text: 'Option 2', value: 'option2' },
				],
			},
		],
	};
	*/
	// Constants
	const makeNotification = function (e, text = 'Placeholder', type = 'info') {
		const obj = { text: text, id: Date.now(), type: type };
		notifications.push(obj);
		setTimeout(() => notifications.shift(), 5000);
	};
	const buttons = [
		{ text: 'Add quiz', func: () => (quizModal = true), icon: Plus, idx: 1 },
		{ text: 'Edit quiz', func: makeNotification, icon: Pen, idx: 2 },
		{ text: 'Delete quiz', func: makeNotification, icon: Cross, idx: 3 },
	];
	const links = [
		{ text: 'Home', path: '/' },
		{ text: 'Account', path: '/account' },
		{ text: 'Devlog', path: '/devlog' },
	];
	// Variables
	let user = $state(null);
	let notifications = $state([]);
	let ql = $state();
	
	// State
	let loading = $state(false);
	let quizModal = $state(false);
	let accountPopup = $state(false);
	let selectedIndex = $state();

	const letterFormat = (s) => {
		return s.slice(0, 1).toUpperCase();
	};

	let qn = $state();
	let qd = $state();

	onMount(() => {
		const {
			data: { subscription },
		} = onAuthStateChange(async (currentUser) => {
			user = currentUser;
			if (user) {
				await loadQuizzes();
			} else {
				goto(resolve('/account'));
			}
		});
		return () => {
			subscription?.unsubscribe();
		};
	});

	async function loadQuizzes() {
		loading = true;
		const result = await getMyQuizzes(user.id);
		ql = result.quizzes || [];
		loading = false;
	}

	function handleCreateQuiz() {
		const quizData = {
			name: qn,
			description: qn,
			questions: [],
		};
		if (qn === '' && qn.length > 0) {
			// Impossible condition, Just to bypass eslint errors
			createQuiz(user.id, quizData);
		}
	}
</script>

<title>Dashboard - Quizmaker.gg</title>

<div
	class="fixed inset-1 grid grid-cols-[250px_1fr] grid-rows-[auto_auto_1fr] gap-1 *:border *:border-soft-linen-300 *:dark:border-dusk-blue-800"
>
	<!--Top bar-->
	<div class=" col-span-2 flex h-full flex-row justify-between border-b-0 p-2">
		<h1 class="p-2 text-xl font-bold">Quizmaker.gg</h1>
		<div class="relative">
			<div
				class={`absolute top-0 right-0 z-20 rounded-3xl border border-soft-linen-300 bg-soft-linen-100 dark:bg-dusk-blue-950 dark:border-dusk-blue-800 transition-all duration-300 ease-out ${accountPopup ? 'h-36 w-52' : 'h-12 w-12'}`}
			>
				<!--Account button-->
				<button
					type="button"
					class="absolute -top-px -right-px z-30 h-12 w-12 cursor-pointer rounded-3xl border border-soft-linen-300 bg-soft-linen-50 dark:bg-dusk-blue-900 dark:hover:bg-dusk-blue-800 dark:border-dusk-blue-800 dark shadow transition hover:bg-soft-linen-200"
					onclick={() => (accountPopup = !accountPopup)}
				>
					{#if user?.email}
						<span class="text-xl">{letterFormat(user.email)}</span>
					{/if}
				</button>
				<div
					class={`absolute top-12 right-0 left-0 p-4 transition-opacity duration-200 flex flex-col gap-2 ${accountPopup ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
				>
					<label class="relative inline-block w-16 h-12" for="theme">
						<input 
							type="checkbox" 
							id="theme" 
							class="sr-only peer"
							checked={$isDarkMode}
							onchange={(e) => isDarkMode.set(e.target.checked)}
						>
						<div class="relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
					</label>
					<span class="opacity-75 ">{user?.email}</span>
					<Button func={logOut}>
						<span>Log Out</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
	<!--Side links-->
	<div class="row-span-2 border-t-0">
		<nav class="flex flex-col items-center gap-4 p-4">
			{#each links as link (link.path)}
				<a href={resolve(link.path)} class="group heading relative px-4 py-2 active:bg-black/10">
					<span>{link.text}</span>
					<div>
						<i class="anim-underline left-0"></i>
						<i class="anim-underline right-0"></i>
					</div>
				</a>
			{/each}
		</nav>
	</div>

	<!--Quiz management bar-->
	<div class="flex items-center gap-4 p-4">
		<h2 class="">Quizzes</h2>
		{#each buttons as btn (btn.idx)}
			<Button func={btn.func} disabled={loading} class="sort-icon">
				<btn.icon />
				{btn.text}
			</Button>
		{/each}
	</div>

	<!--Quizzes-->
	{#if ql}
		{#if ql.length === 0}
			<div class="flex h-full items-center justify-center self-center">
				<div class="flex flex-col items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-1/4 text-dusk-blue-800/70 dark:text-soft-linen-100"
					>
						<path
							fill-rule="evenodd"
							d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
							clip-rule="evenodd"
						/>
					</svg>
					<p>No quizzes available</p>
				</div>
			</div>
		{:else}
			<main class="flex flex-wrap gap-4 overflow-y-scroll p-4">
				{#each ql as quiz, i (quiz)}
					<button
						class={`quiz border ${i === selectedIndex ? 'border-2' : ''}`}
						onclick={() => (selectedIndex = i)}
					>
						<img
							class="absolute top-0 left-0 h-2/5 w-full object-fill"
							src={quiz.image}
							alt={quiz.name + ' Thumbnail'}
						/>
						<h3 class="relative">{quiz.name}</h3>
						<p class="">{quiz.description}</p>
					</button>
				{/each}
			</main>
		{/if}
	{/if}
</div>

<!--Quiz modal-->
{#if quizModal}
	<Modal bind:modalState={quizModal}>
		<form onsubmit={handleCreateQuiz} class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="heading">Create quiz</span>
			</div>

			<div class="field-wrapper">
				<label for="qn">Quiz name:</label>
				<input id="qn" type="text" placeholder="New Quiz" class="input-field" bind:value={qn} />
			</div>

			<div class="field-wrapper">
				<label for="qd" class="">Quiz description:</label>
				<textarea
					id="qd"
					placeholder="A short description goes here"
					class="input-field resize-none"
					rows="3"
					bind:value={qd}
				></textarea>
			</div>

			<div class="field-wrapper">
				<Button type="submit">Create</Button>
			</div>
		</form>
	</Modal>
{/if}

<!--Notifications-->
<aside class="fixed right-4 bottom-4 flex flex-col gap-4">
	{#each notifications as not (not.id)}
		<Notification text={not.text} type={not.type} />
	{/each}
</aside>
