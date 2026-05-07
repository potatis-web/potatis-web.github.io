<script>
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { logIn, signUp, getCurrentUser } from '$lib/auth.js';
  import { onMount } from 'svelte';
  import waveBG from '$lib/stacked-waves-haikei.svg'

  // import { slide } from 'svelte/transition'; // remove if unused later

  let loginState = $state(false);
  let email = $state();
  let password = $state();

  onMount(async () => {
    const user = await getCurrentUser();
    if (user) {
      console.log(user)
      goto(resolve('/dashboard'))
    }
  })

  async function handleSubmit(e) {
    e.preventDefault();
    let response
    if (loginState) {
      response = await logIn(email, password);
    } else {
      response = await signUp(email, password)
    }
    console.log(response);

    if (response.success) {
      goto(resolve('/dashboard'));
    }
    
  }

  function getMode(state = loginState) {
    return state ? 'Log In' : 'Sign Up';
  }

  function validateForm() {


  }
</script>
<title>{getMode()} - Quizmaker.gg</title>
<main class="fixed inset-0 flex justify-center items-center">
  <img src={waveBG} alt="background" class="fixed">

  <form class="z-10 flex flex-col bg-soft-linen-100 p-8 rounded-2xl gap-4 h-4/5 w-1/3 shadow relative animate-fade-in" onsubmit={handleSubmit}>
    <h1 class="heading">{getMode()}</h1>
    <div class="field-wrapper">
      <label for="email">E-Mail:</label>
      <input required placeholder="example@email.com" id="email" type="email" class="input-field" bind:value={email} oninput={validateForm}>
    </div>
    
    <div class="field-wrapper">
      <label for="password" class="">Password:</label>
      <input required placeholder="●●●●●●●●" id="password" type="password" class="input-field" bind:value={password} oninput={validateForm}>
    </div>

    <div class="field-wrapper justify-end">
      <input type="submit" id="submit" value={getMode()} class="btn-primary">
    </div>

    <div class="absolute bottom-8">
      <span>{!loginState ? 'Already have an' : 'No '} account?</span>
      <button class="underline cursor-pointer" onclick={() => {loginState = !loginState}}>{getMode(!loginState)}</button> 
      <span>instead</span>
    </div>

  </form>
</main>

