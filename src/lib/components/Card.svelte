<script>
  import { fade } from "svelte/transition";
  let {children} = $props();
</script>
<div transition:fade class="fixed inset-0 flex justify-center items-center z-20">
  <div class="relative w-full max-w-3xl max-h-11/12 rounded-3xl border border-soft-linen-300 dark:border-dusk-blue-800 bg-soft-linen-100 dark:bg-dusk-blue-950 p-6 shadow-2xl">
    {@render children?.()}
  </div>
</div>