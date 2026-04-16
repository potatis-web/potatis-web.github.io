<script>
  import { onMount } from "svelte";
  import { resolve } from "$app/paths"
	import { goto } from "$app/navigation";
  
  const quizTemplate = {
    id: "quiz-new",
    name: "New Quiz",
    description: "A short description goes here",
    image: "https://blocks.astratic.com/img/general-img-square.png",
    q: [
      {
        title: "Sample question?",
        options: [
          { text: "Option 1", value: "option1" },
          { text: "Option 2", value: "option2" }
        ]
      }
    ]
  };
  let selectedIndex = $state();
  $inspect(selectedIndex)
  const userTemplate = {
		ql: [
			{
				id: "quiz-1",
				name: "Cheese Quiz",
				description: "Test your cheese knowledge",
				image: "https://www.schultzscheese.com/wp-content/uploads/2015/06/swiss.jpg",
				q: [
					{
						title: "Is cheese good?",
						options: [
							{ text: "Yes, absolutely!", value: "yes" },
							{ text: "No, not really", value: "no" },
							{ text: "It depends on the type", value: "maybe" }
						]
					},
					{
						title: "What's your favorite cheese?",
						options: [
							{ text: "Cheddar", value: "cheddar" },
							{ text: "Mozzarella", value: "mozzarella" },
							{ text: "Brie", value: "brie" },
							{ text: "Blue cheese", value: "blue" }
						]
					}
				]
			}
		]
	};

	let userData = $state({});

  onMount(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      localStorage.setItem("user",JSON.stringify(userTemplate));
      userData = userTemplate;
    } else {
      userData = JSON.parse(storedUser)
    }
  });
  $effect(() => {
    localStorage.setItem("user", JSON.stringify(userData))
  })
  
  function addQuiz() {
    if (!userData.ql) {
      userData.ql = [];
    }
    userData.ql.push({
      ...quizTemplate,
      id: `quiz-${Date.now()}`
    });
    selectedIndex = userData.ql.length - 1;
  }
  function deleteQuiz() {
    userData.ql.splice(selectedIndex,1)
    selectedIndex = userData.ql.length - 1;
  }
  function editQuiz() {
    if (selectedIndex === null || selectedIndex === -1) {
      console.log('Invalid index!'); 
      return;
    }
    goto(resolve(userData.ql[selectedIndex ?? 0].id));
  }
</script>


<div class="w-screen h-screen grid grid-rows-[auto_auto_1fr] grid-cols-[250px_1fr] gap-1 *:border">
  <div class=" border-b-0 flex justify-center items-center h-full col-span-2">
    <h1 class="text-neutral-50">Quizmaker.gg</h1>
  </div>
  <div class="border-t-0 row-span-2"></div>
  <div class="flex items-center gap-4 p-4">
    <h2 class="text-neutral-50">Quizzes</h2>
    <button class="btn-primary" onclick={addQuiz}>+ Add</button>
    <button class="btn-primary" onclick={editQuiz}>Edit</button>
    <button class="btn-primary" onclick={deleteQuiz}>Delete</button>
  </div>
  <main class="flex flex-wrap gap-4 p-4 overflow-y-scroll">
    {#if userData.ql}
      {#each userData.ql as quiz, i (quiz)}
        <button class={`quiz border ${i === selectedIndex ? "border-2 shadow-neutral-500" : ""}`} onclick={() => selectedIndex = i}>
          <img class="absolute h-2/5 left-0 top-0 object-fill w-full" src={quiz.image} alt={quiz.name + " Thumbnail"}>
          <h3 class="relative">{quiz.name}</h3>
          <p class="text-neutral-400">{quiz.description}</p>
        </button>
      {/each}
    {/if}
  </main>
</div>
<style>
  /*Pending ~~fix~~ REMOVAL for class used by TailwindCSS*/
  :global(.hl) {
    content: "";
    /*@apply border border-blue-50 border-solid;*/
  }
  :global(body) {
    background-color: var(--color-neutral-600);
  }
</style>