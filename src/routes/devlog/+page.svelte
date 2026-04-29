<script>
	import { resolve } from "$app/paths";
</script>
<main class="flex items-center flex-col p-4 gap-4">
  <h1 class="font-bold text-4xl p-4 border-b-2">Devlogs</h1>

  <nav class="overflow-y-scroll">
    <a href="{resolve('/devlog/1/')}">
      <article class="border-2 border-soft-linen-200 w-[50vw] rounded">Devlog 1</article>
    </a>
  </nav>

</main>