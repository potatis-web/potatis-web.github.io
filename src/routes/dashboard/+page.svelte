<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import Notification from '$lib/Notification.svelte';
	import { onAuthStateChange, getCurrentUser, logOut } from '$lib/auth';
	import { fade } from 'svelte/transition';
	import { getMyQuizzes } from '$lib/quizManager';
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
	let user = $state(null);
	let notifications = $state([]);
	let loading = $state(false);
	let modalOpen = $state(false);
	let ql = $state();
	const letterFormat = (s) => {return s.slice(0,1).toUpperCase()}

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
	<!--Top bar-->
	<div class=" col-span-2 flex h-full flex-row justify-between border-b-0 p-2">
		<h1 class="p-2 text-xl font-bold">Quizmaker.gg</h1>
		<button class="btn-primary h-12 w-12 bg-soft-linen-50">
			{#if user?.email}
				<span class="text-xl">{letterFormat(user?.email)}</span>
			{/if}
		</button>
		<button class="btn-primary" onclick={logOut}>Log out</button>
	</div>

	<div class="row-span-2 border-t-0">
		<nav class="flex flex-col items-center gap-4 p-4">
			<a href={resolve('/')} class="group heading relative px-4 py-2 active:bg-black/10">
				<span>Home</span>
				<div>
					<i class="anim-underline left-0"></i>
					<i class="anim-underline right-0"></i>
				</div>
			</a>
			<a href={resolve('/account')} class="group heading relative px-4 py-2 active:bg-black/10">
				<span>Account</span>
				<div>
					<i class="anim-underline left-0"></i>
					<i class="anim-underline right-0"></i>
				</div>
			</a>
			<a href={resolve('/devlog')} class="group heading relative px-4 py-2 active:bg-black/10">
				<span>Devlog</span>
				<div>
					<i class="anim-underline left-0"></i>
					<i class="anim-underline right-0"></i>
				</div>
			</a>
		</nav>
	</div>

	<!--Quiz management-->
	<div class="flex items-center gap-4 p-4">
		<h2 class="">Quizzes</h2>
		<button class="btn-primary sort-icon" onclick={() => (modalOpen = true)} disabled={loading}>
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
		<button class="btn-primary sort-icon" onclick={makeNotification()} disabled={loading}>
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
		<button class="btn-primary sort-icon" onclick={makeNotification()} disabled={loading}>
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
	{#if ql}
		{#if ql.length === 0}
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

<!--svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
<!--Modal-->
{#if modalOpen}
	<div
		class="modal-backdrop flex items-center justify-center"
		onclick={() => (modalOpen = false)}
		onkeydown={(e) => {
			modalOpen = e.key !== 'Escape';
		}}
		transition:fade
	>
		<div onclick={(e) => e.stopPropagation()} class="modal-panel">
			<form class="flex flex-col gap-4">
				<div class="flex items-center">
					<span class="heading self-start">Make a quiz</span>
					<button class="btn-primary" onclick={() => (modalOpen = false)}>X</button>
				</div>
				<div class="field-wrapper">
					<label for="qn">Quiz name:</label>
					<input id="qn" type="text" placeholder="New Quiz" class="input-field" />
				</div>
				<div class="field-wrapper">
					<label for="qd" class="">Quiz description:</label>
					<textarea
						id="qd"
						placeholder="A short description goes here"
						class="input-field resize-none"
						rows="2"
					></textarea>
				</div>
			</form>
		</div>
	</div>
{/if}

<!--Notifications-->
<aside class="fixed right-4 bottom-4 flex flex-col gap-4">
	{#each notifications as not (not.id)}
		<Notification text={not.text} type={not.type} />
	{/each}
</aside>
