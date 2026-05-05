<script>
  import { goto } from '$app/navigation';
  import { logIn, signUp, getCurrentUser } from '$lib/auth.js';
  import { onMount } from 'svelte';
  import waveBG from '$lib/stacked-waves-haikei.svg'
</script>

<main class="fixed inset-0 flex justify-center items-center">
  <img src={waveBG}>
</main>