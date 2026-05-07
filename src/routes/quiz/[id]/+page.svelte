<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Notification from '$lib/Notification.svelte';

	const questionTemplate = {
		title: 'Sample question?',
		options: [
			{
				text: 'Option 1',
				value: 'option1',
			},
			{
				text: 'Option 2',
				value: 'option2',
			},
		],
	};
	const saveDelay = 300;
	let userData = $state();
	let quizId = $state();
	let quiz = $state();
	let thumbnailFiles = $state();
	let currentQuestionIndex = $state(0);
	let notifications = $state([]);
	let modalOpen = $state(false);
	let loaded = $state(false);
	const warningFlags = {
		name: false,
		question: false,
		emptyQuestionList: false,
	};
	let hasQuestions = true;

	onMount(() => {
		const storedUser = localStorage.getItem('user');

		if (!storedUser) {
			localStorage.setItem('user', JSON.stringify({ dick: 'aaa' }));
		} else {
			userData = JSON.parse(storedUser);
		}
		// Get quiz id

		quizId = page.params.id;


		// Find in userData
		quiz = userData.ql?.find(findQuiz);

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
		}, saveDelay);
	});

	function validateValues() {
		if (!quiz) return;

		// Check for missing quiz name
		if (quiz.name === '' && !warningFlags.name) {
			warningFlags.name = true;
			makeNotification('Warning: Quiz name is empty. Please add one before exiting', 'warn');
		} else if (quiz.name !== '' && warningFlags.name) {
			warningFlags.name = false;
		}

		// Check for missing question title
		const hasEmptyQuestion = quiz.q?.some((question) => !question?.title?.trim());
		if (hasEmptyQuestion && !warningFlags.question) {
			warningFlags.question = true;
			makeNotification(
				'Warning: One or more questions are empty. Please add question text before exiting',
				'warn',
			);
		} else if (!hasEmptyQuestion && warningFlags.question) {
			warningFlags.question = false;
		}

		// Check of missing question(s)
		hasQuestions = !!quiz.q;

		if (!hasQuestions && !warningFlags.emptyQuestionList) {
			warningFlags.emptyQuestionList = true;
			makeNotification(
				'Warning: Quiz contains no questions. Please add one before exiting',
				'warn',
			);
		} else if (hasQuestions && warningFlags.emptyQuestionList) {
			warningFlags.emptyQuestionList = false;
		}
	}

	function findQuiz(quiz) {
		return quiz.id === quizId;
	}

	function makeNotification(text, type = 'info') {
		const obj = { text: text, id: Date.now(), type: type };
		notifications.push(obj);
		setTimeout(() => notifications.shift(), 5000);
	}

	$effect(() => {
		if (!thumbnailFiles || thumbnailFiles.length === 0 || !quiz) return;

		const file = thumbnailFiles[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			quiz.image = e.target.result;
		};
		reader.readAsDataURL(file);
	});
</script>

<!--svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->

{#if quiz}
	<title>{quiz.name ? quiz.name : 'Empty'} - Quizmaker.gg</title>
	{#if modalOpen}
		<div class="modal-backdrop"></div>
		<div
			class="fixed inset-0 z-9999 flex items-center justify-center"
			onclick={() => {
				modalOpen = false;
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') modalOpen = false;
			}}
		>
			<div
				onclick={(e) => {
					e.stopPropagation();
				}}
				role="dialog"
				aria-modal="true"
				tabindex="0"
				class="relative h-9/10 w-1/2 rounded border-soft-linen-300 bg-soft-linen-100 text-dusk-blue-900 shadow"
			>
				<button
					class="btn-primary absolute top-2 right-2"
					onclick={() => {
						modalOpen = false;
					}}
					aria-label="close-modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5"
						aria-label="button"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	{/if}
	<main class="fixed inset-1 grid grid-cols-[300px_1fr] grid-rows-[1fr_275px] shadow">
		<aside class="z-10 row-span-2 flex flex-col items-center gap-4 shadow">
			<div class="grid h-40 w-full grid-cols-2 grid-rows-3">
				<div class="row-span-2 flex items-center justify-around">
					<h1 class="">{quiz.name}</h1>
					<button aria-label="settings" class="btn-primary" onclick={() => (modalOpen = true)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="size-6"
						>
							<path
								fill-rule="evenodd"
								d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
				<div class="row-span-2">
					<!--Image picker-->
					<div
						class="relative flex h-full w-full items-center justify-center border-soft-linen-200"
					>
						<img src={quiz.image} alt="quiz thumbnail" class="h-full w-full object-fill" />
						<label for="thumbnail" class="absolute right-1 bottom-1 cursor-pointer">
							<!--"arrow-up-tray" on https://heroicons.com/ -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 rounded bg-black/10 p-1 text-dusk-blue-800"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
								/>
							</svg>
						</label>
						<input
							id="thumbnail"
							type="file"
							class="hidden"
							accept="image/*"
							bind:files={thumbnailFiles}
						/>
					</div>
				</div>

				<!--Sidebar controls for question management-->
				<div
					class="col-span-2 flex flex-row items-center justify-around border-b-soft-linen-200 p-8 shadow"
				>
					<button
						class="btn-primary"
						onclick={() => {
							quiz.q = [
								...quiz.q,
								{ ...structuredClone(questionTemplate), id: `${quiz.id}-${crypto.randomUUID()}` },
							];
							validateValues();
						}}
					>
						Add</button
					>
					<button
						class="btn-primary"
						onclick={() => {
							quiz.q.pop();
							validateValues();
						}}>Delete</button
					>
					<a class="btn-primary" href={resolve('/dashboard')}>Dashboard</a>
				</div>
			</div>

			<!--Question sidebar-->
			<div class="flex h-full w-full flex-col items-center gap-4 overflow-y-scroll p-4">
				{#each quiz.q as question, i (question.id)}
					<button
						class={`btn-primary w-5/6 truncate p-6 ${question.title?.trim() ? '' : 'text-neutral-500'}`}
						onclick={() => {
							currentQuestionIndex = i;
						}}>{question.title?.trim() ? question.title : '- Empty -'}</button
					>
				{/each}
			</div>
		</aside>

		<div class="flex flex-col items-center justify-around">
			<!--Question title input-->
			<input
				placeholder="Add your question here!"
				class="text-field w-9/10 border-b text-4xl"
				oninput={validateValues}
				bind:value={quiz.q[currentQuestionIndex].title}
			/>

			<!--Options text/value input-->
			<div class="h-full w-9/10 flex-wrap gap-4">
				{#each quiz.q[currentQuestionIndex].options as option, i (i)}
					<div class="inline-flex h-full w-1/2">
						<input class="text-field" bind:value={option.text} />
						<input class="text-field" bind:value={option.value} />
					</div>
				{/each}
			</div>
		</div>
		<div class=""></div>
	</main>
{:else}
	<!--Error/not found page-->
	<title>Quiz not found - Quizmaker.gg</title>
	<main class="flex h-screen items-center justify-center">
		<div class="relative flex flex-col items-center gap-8 *:text-center">
			<div
				class="h-24 w-24 animate-spin rounded-full border-16 border-dry-sage-200 border-t-dusk-blue-500"
			></div>
			<h1 class="text-2xl">Quiz may not be available right now. Refresh or try again later.</h1>
			<h2>QuizID: <span class="text-dusk-blue-600">{quizId?.slice(5)}</span></h2>
			<a href={resolve('/dashboard')} class="btn-primary">Back to dashboard</a>
		</div>
	</main>
{/if}

<!--Notifications-->
<aside class="fixed right-4 bottom-4 z-50 flex flex-col gap-4">
	{#each notifications as not (not.id)}
		<Notification text={not.text} type={not.type} />
	{/each}
</aside>
