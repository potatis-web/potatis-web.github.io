<script>
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";
	import Button from "$lib/components/Button.svelte";
  const links = [
    {text: "To Account", func: () => goto(resolve('/account'))},
    {text: "To Devlog", func: () => goto(resolve('/devlog'))},
    {text: "To Dashboard", func: () => goto(resolve('/dashboard'))},
  ]
</script>
<div class="fixed inset-0 flex justify-center items-center flex-col gap-4">
  {#each links as link (link.text)}
    <Button func={link.func}>{link.text}</Button>
  {/each}
</div>