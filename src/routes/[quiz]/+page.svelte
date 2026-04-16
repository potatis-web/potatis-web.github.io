<script>
  import { onMount } from "svelte";

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
  }
  
  let userData = $state({})
  let quizId = $state()
  let quiz = $state();
  let thumbnailFiles = $state();
  let currentQuestionIndex = $state(0);
  onMount(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      localStorage.setItem("user",JSON.stringify({dick: 'aaa'}));
    } else {
      userData = JSON.parse(storedUser)
    }
    // Get quiz id
    let gulp = window.location.href.split('/');
    quizId = 'q'+gulp[gulp.length-1]
    
    // Find in userData
    quiz = userData.ql?.find(findQuiz)
  });
  $effect(() => {
    localStorage.setItem("user", JSON.stringify(userData))
  });
  function findQuiz (quiz) {
    return quiz.id === quizId
  }

  $effect(() => {
    if (!thumbnailFiles || thumbnailFiles.length === 0 || !quiz) return;

    const file = thumbnailFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      quiz.image = e.target.result;
    }
    reader.readAsDataURL(file)

  });
</script>
{#if quiz}
<title>{quiz.name} - Quizmaker.gg</title>
<main class="grid grid-cols-[250px_1fr] grid-rows-[1fr_275px] h-screen bg-neutral-600">
  <aside class="row-span-2 flex items-center flex-col gap-4 shadow-2xl z-10">
    
      
      <div class="w-full h-40 grid grid-cols-2 grid-rows-3 *:border">
        <input type="text" class="row-span-2 h-1/2 text-center" bind:value={quiz.name}>
        <div class="row-span-2 ">
          <div class="h-full w-full flex justify-center items-center relative">
            <img src={quiz.image} alt="quiz thumbnail" class="object-fill h-full w-full">
            <label for="thumbnail" class="absolute bottom-1 right-1 cursor-pointer">
              <!--"arrow-up-tray" on https://heroicons.com/ -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-neutral-200 bg-black/10 p-1 rounded">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </label>
            <input id="thumbnail" type="file" class="hidden" accept="image/*" bind:files={thumbnailFiles}>
          </div>
        </div>

        <div class="col-span-2 flex items-center justify-around flex-col">
          <button class="btn-primary w-1/3" onclick={() => quiz.q.push(questionTemplate)}>Add</button>
          <button class="btn-primary w-1/3" onclick={() => quiz.q.pop()}>Delete</button>
        </div>
        

      </div>
      <div class="overflow-y-scroll h-full w-full flex flex-col items-center gap-4">
        {#each quiz.q as question, i (question)}
          <button class="btn-primary p-6 w-5/6 border" onclick={() => {currentQuestionIndex = i}}>{question.title}</button>
        {/each}
      </div>
    
      
  </aside>

  <div class="border flex flex-col ">
    <input class="text-center text-4xl font-medium" bind:value={quiz.q[currentQuestionIndex].title}/>
  </div>
  <div class="border"></div>
</main>
{:else}


<title>Quiz not found - Quizmaker.gg</title>
<main class="h-screen bg-neutral-600 flex justify-center items-center *:text-neutral-200">
  <div class="relative flex flex-col items-center gap-8 *:text-center">
    <div class="rounded-full border-16 border-neutral-700 border-t-blue-400 w-24 h-24 animate-spin"></div>
    <h1 class="text-2xl">Quiz may not be available right now. Refresh or try again later.</h1>
    <h2>QuizID: <span class="text-neutral-400">{quizId?.slice(5)}</span></h2>
  </div>
</main>
{/if} 