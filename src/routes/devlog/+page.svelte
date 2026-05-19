<script>
  import Peak from '$lib/assets/peaks.gif';
  const devlogs = $state([
    {title: "Devlog - 1", text: "E", img: Peak}
  ]);
</script>
<main class="flex items-center flex-col p-4 gap-4">
  <h1 class="font-bold text-4xl p-4 border-b-2">Devlogs</h1>

  <nav class="overflow-y-scroll flex flex-col gap-4">
    {#each devlogs as log (log.title)}
      <article class="border-2 border-soft-linen-200 w-[50vw] rounded p-6 flex justify-between shadow cursor-pointer">
        <div>
          <h2 class="heading">{log.title}</h2>
          <p>{log.text}</p>
        </div>
        <img class="max-w-1/5 shadow" src={log.img} alt={log.img}>
      </article>
    {/each}
  </nav>

</main>