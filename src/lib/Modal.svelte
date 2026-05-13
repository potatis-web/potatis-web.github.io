<script>
	import { fade } from "svelte/transition";
	import Button from "./Button.svelte";

  // eslint-disable-next-line -- eslint does not detect $bindable directive in svelte
  let {children, modalState = $bindable()} = $props();
</script>
<div>
  <!--svelte-ignore a11y_no_static_element_interactions-->
  <div
    transition:fade
    class="fixed inset-0 backdrop-blur-sm bg-black/10"
    onclick={() => modalState = false}
    window.onkeydown={(e) => { if (e.key === "Escape") modalState = false; }}
  >
  </div>
  <!--svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
  <div transition:fade class="relative w-full max-w-3xl rounded-3xl border border-soft-linen-300 bg-soft-linen-100 p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
    <Button class="absolute top-0 right-0" ariaLabel="Close modal" func={() => modalState = false}>
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