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
    return mode === 'login' ? 'Log-In' : 'Sign-Up'
  }
</script>

<main class="fixed inset-0 flex justify-center items-center">
  <img src={waveBG} alt="background" class="fixed">
  <form class="bg-soft-linen-100 h-9/10 w-3/5 shadow z-10 rounded flex flex-col gap-4 p-4 " onsubmit={handleSubmit}>
    <h1>{getMode()}</h1>
    <div class="field-wrapper">
      <label for="email">E-Mail:</label>
      <input placeholder="example@email.com" id="email" type="email" class="border-2 border-soft-linen-300 p-2 rounded">
    </div>
    <div class="field-wrapper">
      <label for="password" class="">Password:</label>
      <input placeholder="Password" id="password" type="password" class="border-2 border-soft-linen-300 p-2 rounded ">
    </div>

    <div class="field-wrapper">
      <label for="submit">{getMode()}</label>
      <input type="submit" id="submit" class="btn-primary">
    </div>

    <div>
      {mode === 'login' ? 'Already have an' : 'No '} account?
      <button class="btn-primary" onclick={() => {mode = mode === 'signin' ? 'login' : 'signin'}}>{getMode()}</button>
      <button class="btn-primary">Cancel</button>
    </div>

    
  </form>
</main>