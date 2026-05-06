<script>
  import { goto } from '$app/navigation';
  import { logIn, signUp, getCurrentUser } from '$lib/auth.js';
  import { onMount } from 'svelte';
  import waveBG from '$lib/stacked-waves-haikei.svg'

  let mode = $state('signin');

  function handleSubmit(e) {
    e.preventDefault();
  }

  function getMode() {
    return mode === 'login' ? 'Log In' : 'Sign Up';
  }

  function validateForm() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const val = password.getAttribute("value")
    console.log(val)
  }
</script>
<title>{getMode()} - Quizmaker.gg</title>
<main class="fixed inset-0 flex justify-center items-center">
  <img src={waveBG} alt="background" class="fixed">

  <form class="z-10 flex flex-col bg-soft-linen-100 p-8 rounded-2xl gap-4 h-4/5 w-1/3 shadow relative animate-fade-in" onsubmit={handleSubmit}>
    <h1 class="heading">{getMode()}</h1>
    <div class="field-wrapper">
      <label for="email">E-Mail:</label>
      <input required placeholder="example@email.com" id="email" type="email" class="input-field" oninput={validateForm}>
    </div>
    <div class="field-wrapper">
      <label for="password" class="">Password:</label>
      <input required placeholder="Password" id="password" type="password" class="input-field" oninput={validateForm}>
    </div>

    <div class="field-wrapper">
      <label for="submit">{getMode()}</label>
      <input type="submit" id="submit" class="btn-primary">
    </div>

    <div class="absolute bottom-8">
      {mode === 'login' ? 'Already have an' : 'No '} account?
      <button class="underline cursor-pointer" onclick={() => {mode = mode === 'signin' ? 'login' : 'signin'}}>{getMode()}</button> instead
    </div>

    
  </form>
</main>

