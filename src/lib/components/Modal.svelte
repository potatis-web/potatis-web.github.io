<script>
	import { fade } from "svelte/transition";
	import Button from "./Button.svelte";

  
  let {children, modalState = $bindable()} = $props(); // eslint-disable-line no-useless-assignment 

</script>
<svelte:window onkeydown={(e) => { if (e.key === "Escape") modalState = false; }}></svelte:window>
<div transition:fade class="fixed inset-0 flex justify-center items-center z-20">
  <!--svelte-ignore a11y_no_static_element_interactions,a11y_click_events_have_key_events-->
  <div
    class="absolute inset-0 backdrop-blur-sm bg-black/10"
    onclick={() => modalState = false}
  >
  </div>
  <!--svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
  <div class="relative w-full max-w-3xl max-h-11/12 rounded-3xl border border-soft-linen-300 bg-soft-linen-100 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
    <Button class="absolute top-6 right-6 size-12" ariaLabel="Close modal" func={() => modalState = false}>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </Button>
    {@render children?.()}
  </div>
</div>
