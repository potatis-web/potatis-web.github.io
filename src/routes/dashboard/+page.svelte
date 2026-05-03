<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import Notification from '$lib/Notification.svelte';
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
	let selectedIndex = $state();
	const userTemplate = {
		ql: [
			{
				id: 'quiz-1',
				name: 'Cheese Quiz',
				description: 'Test your cheese knowledge',
				image: 'https://www.schultzscheese.com/wp-content/uploads/2015/06/swiss.jpg',
				q: [
					{
						title: 'Is cheese good?',
						options: [
							{ text: 'Yes, absolutely!', value: 'yes' },
							{ text: 'No, not really', value: 'no' },
							{ text: 'It depends on the type', value: 'maybe' },
						],
					},
					{
						title: "What's your favorite cheese?",
						options: [
							{ text: 'Cheddar', value: 'cheddar' },
							{ text: 'Mozzarella', value: 'mozzarella' },
							{ text: 'Brie', value: 'brie' },
							{ text: 'Blue cheese', value: 'blue' },
						],
					},
				],
			},
		],
	};

	const saveDelay = 300;
	let userData = $state();
	let notifications = $state([]);
	let loaded = $state(false);

	onMount(() => {
		const storedUser = localStorage.getItem('user');

		if (!storedUser) {
			localStorage.setItem('user', JSON.stringify(userTemplate));
			userData = userTemplate;
		} else {
			userData = JSON.parse(storedUser);
		}
		loaded = true;
	});

	// For saving to localStorage
	let saveTimeout;
	$effect(() => {
		if (!loaded) return;

    const snapshot = $state.snapshot(userData);
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			localStorage.setItem('user', JSON.stringify(snapshot));
      console.log("Saved to localStorage")
		}, saveDelay);
	});

	function addQuiz() {
		if (!userData.ql) {
			userData.ql = [];
		}
		userData.ql.push({
			...quizTemplate,
			id: `${crypto.randomUUID()}`,
		});
		selectedIndex = userData.ql.length - 1;
	}

	function deleteQuiz() {
		if (selectedIndex === null || selectedIndex === -1 || selectedIndex === undefined) {
			makeNotification('No quiz selected', 'info');
			return;
		}
		userData.ql.splice(selectedIndex, 1);
		selectedIndex = userData.ql.length - 1;
	}

	function editQuiz() {
		if (selectedIndex === null || selectedIndex === -1) {
			makeNotification('No quiz selected ', 'info');
			return;
		}
		goto(resolve(`/quiz/${userData.ql[selectedIndex ?? 0].id}`));
	}

	function makeNotification(text, type = 'info') {
		const obj = { text: text, id: Date.now(), type: type };
		notifications.push(obj);
		setTimeout(() => notifications.shift(), 5000);
	}
</script>

<title>Dashboard - Quizmaker.gg</title>

<div
	class="fixed inset-1 grid grid-cols-[250px_1fr] grid-rows-[auto_auto_1fr] gap-1 *:border *:border-soft-linen-300"
>
	<!--TODO: add content in top bar (maybe icon or something?)-->
	<div class=" col-span-2 flex h-full items-center justify-center border-b-0">
		<h1 class="p-2 text-xl font-bold">Quizmaker.gg</h1>
	</div>

	<!--TODO: add content in side bar-->
	<div class="row-span-2 border-t-0"></div>

	<!--Quiz management-->
	<div class="flex items-center gap-4 p-4">
		<h2 class="">Quizzes</h2>
		<button class="btn-primary sort-icon" onclick={addQuiz}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
			<span>Add Quiz</span>
		</button>
		<button class="btn-primary sort-icon" onclick={editQuiz}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
				/>
			</svg>
			<span>Edit Quiz</span>
		</button>
		<button class="btn-primary sort-icon" onclick={deleteQuiz}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
			<span>Delete Quiz</span>
		</button>
	</div>
	{#if userData?.ql}
		{#if userData.ql.length === 0}
			<div class="flex h-full items-center justify-center self-center">
				<div class="flex flex-col items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-1/4 text-dusk-blue-800"
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
				{#each userData.ql as quiz, i (quiz)}
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

<!--Notifications-->
<aside class="fixed right-4 bottom-4 flex flex-col gap-4">
	{#each notifications as not (not.id)}
		<Notification text={not.text} type={not.type} />
	{/each}
</aside>
<!--
Background → Soft Linen 50–100
Cards → Soft Linen 100 / Dry Sage 50
Primary Button → Cornflower Blue 500
Secondary Button → Dusk Blue 500
Borders → Soft Linen 300
Text → Dusk Blue 800–900
Muted Text → Dusk Blue 500
Success/Calm UI → Dry Sage 300–500
Info States → Baby Blue Ice 100–300
-->
