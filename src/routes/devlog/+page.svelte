<script>
  import Notification from "$lib/Notification.svelte";
  let foo = $state([])
  $inspect(foo)
  const bar = [
    'Whispered secrets in the rain',
    'Forgotten keys on Tuesday',
    'Dancing shadows at midnight',
    'Crumpled map of nowhere',
    'Laughter echoes through empty halls',
    'Silver coins in jacket pockets',
    'Stubborn old coffee machine',
    'Neon signs reflecting puddles',
    'Lost socks and mysteries',
    'Humming while nobody listens',
  ]
  function notification() {
    foo.push(bar[Math.floor(Math.random() * bar.length)]);
    setTimeout(() => foo.splice(0,1),5000);
  }
</script>
<h1>devlog</h1>
<button onclick={notification}>Add not</button>
<nav>

</nav>
{#each foo as n (n)}
  <Notification text={n}/>
{/each}