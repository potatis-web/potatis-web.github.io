<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	const questionTemplate = {
		title: 'Sample question?',
		options: [
			{
				text: 'Option 1',
				value: 'option1'
			},
			{
				text: 'Option 2',
				value: 'option2'
			}
		]
	};

	let userData = $state({});
	let quizId = $state();
	let quiz = $state();
	let thumbnailFiles = $state();
	let currentQuestionIndex = $state(0);
	onMount(() => {
		const storedUser = localStorage.getItem('user');

		if (!storedUser) {
			localStorage.setItem('user', JSON.stringify({ dick: 'aaa' }));
		} else {
			userData = JSON.parse(storedUser);
		}
		// Get quiz id
		let gulp = window.location.href.split('/');
		quizId = 'q' + gulp[gulp.length - 1];

		// Find in userData
		quiz = userData.ql?.find(findQuiz);
	});
	$effect(() => {
		localStorage.setItem('user', JSON.stringify(userData));
	});
	function findQuiz(quiz) {
		return quiz.id === quizId;
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

{#if quiz}
	<title>{quiz.name} - Quizmaker.gg</title>
	<main class="grid h-screen grid-cols-[250px_1fr] grid-rows-[1fr_275px] bg-neutral-600">
		<aside class="z-10 row-span-2 flex flex-col items-center gap-4 shadow-2xl">
			<div class="grid h-40 w-full grid-cols-2 grid-rows-3 *:border">
				<input type="text" class="row-span-2 h-1/2 text-center" bind:value={quiz.name} />
				<div class="row-span-2">
					<div class="relative flex h-full w-full items-center justify-center">
						<img src={quiz.image} alt="quiz thumbnail" class="h-full w-full object-fill" />
						<label for="thumbnail" class="absolute right-1 bottom-1 cursor-pointer">
							<!--"arrow-up-tray" on https://heroicons.com/ -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 rounded bg-black/10 p-1 text-neutral-200"
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
				<div class="col-span-2 flex flex-row items-center justify-around">
					<button class="btn-primary" onclick={() => quiz.q.push(questionTemplate)}> Add</button>
					<button class="btn-primary" onclick={() => quiz.q.pop()}>Delete</button>
					<a class="btn-primary" href={resolve('/')}>Dashboard</a>
				</div>
			</div>
			<div class="flex h-full w-full flex-col items-center gap-4 overflow-y-scroll">
				{#each quiz.q as question, i (question)}
					<button
						class="btn-primary w-5/6 border p-6"
						onclick={() => {
							currentQuestionIndex = i;
						}}>{question.title}</button
					>
				{/each}
			</div>
		</aside>

		<div class="flex flex-col border">
			<input
				class="text-center text-4xl font-medium"
				bind:value={quiz.q[currentQuestionIndex].title}
			/>
		</div>
		<div class="border"></div>
	</main>
{:else}
	<title>Quiz not found - Quizmaker.gg</title>
	<main class="flex h-screen items-center justify-center bg-neutral-600 *:text-neutral-200">
		<div class="relative flex flex-col items-center gap-8 *:text-center">
			<div
				class="h-24 w-24 animate-spin rounded-full border-16 border-neutral-700 border-t-blue-400"
			></div>
			<h1 class="text-2xl">Quiz may not be available right now. Refresh or try again later.</h1>
			<h2>QuizID: <span class="text-neutral-400">{quizId?.slice(5)}</span></h2>
		</div>
	</main>
{/if}
