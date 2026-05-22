<script>
  // Svelte logic
  // import { onMount } from 'svelte';
  import { resolve } from '$app/paths'
  import { goto } from '$app/navigation';
	// Components
	import Modal from '$lib/components/Modal.svelte';

	// Assets
	import Peak from '$lib/assets/peaks.gif';
  import Milk from '$lib/assets/milk.gif';
	import Button from '$lib/components/Button.svelte';

	// Constants
	const devlog1 = {
		title: "Devblog - 1",
		image: Peak,
		summary:
			"Den här sessionen handlade mest om att förbättra UI och användarupplevelsen.",
		updates: [
			"Lade till ett notissystem",
			"Gjorde en enkel devloggsida",
			"Förbättrade knappar och layout i dashboarden",
			"Förbättrade quiz-redigeraren",
			"Uppdaterade favicon och animationer",
			"Fixade problem med .nojekyll-filer",
		],
		focus:
			"Målet var att göra appen bättre och lättare att använda, samt att förbättra UI.",
		problems: [
			'"Delete Quiz" kunde gå sönder i vissa fall',
			"Laddningen av quiz blev rörig",
			"Bilduppdateringar fungerade inte alltid som de skulle",
		],
		notes:
			"Mest tid gick åt till att förbättra quiz-redigeraren och göra appen mer lättanvänd.",
		learnings:
			"En enklare laddningslogik gör appen lättare att jobba med, särskilt när man använder sparad data i webbläsaren och routes.",
		nextSteps: [
			"Förbättra sparning och laddning i localStorage",
			"Göra testsidan mer interaktiv",
			"Göra redigering enklare",
			"Lägga till bättre navigation och bekräftelse vid redigering",
		],
	};
	const devlog2 = {
    title: "Devblog - 2",
    image: Milk, // or whatever image you want to use
    summary:
      "Den här sessionen handlade om att integrera Supabase för autentisering och server-baserad quiz-hantering.",
    updates: [
      "Installerade och konfigurerade Supabase-klienten",
      "Implementerade autentisering med registrering, inloggning och utloggning",
      "Skapade auth-service med sessionshantering",
      "Implementerade quiz-manager för server-lagring",
      "Lade till stöd för användarkonton och datapersistens",
      "Skapade kontosida med bakgrundsgrafik",
    ],
    focus:
      "Målet var att flytta quiz-lagringen från lokal webbläsare till en server-baserad lösning med Supabase, och implementera fullständig användarautentisering.",
    problems: [
      "Konfigurering av Supabase-miljövariabler",
      "Hantering av autentiseringsstatus mellan rutter",
      "Synkronisering av quiz-data mellan klient och server",
    ],
    notes:
      "Betydande tid investerades i att förstå Supabase-strukturen och hur autentisering fungerar med SvelteKit. Quiz-managerens komplexitet kom från behovet av att hämta och rekonstruera kapslade datastrukturer från flera databastabeller.",
    learnings:
      "Supabase gör det enkelt att implementera autentisering och databaskommunikation, men noggrann planering av databasschemat är nödvändig för att undvika överdrivna frågor. Kapslade frågeoperationer kan optimeras genom att hämta all data på en gång och rekonstruera strukturen på klientsidan.",
    nextSteps: [
      "Optimera quiz-frågor för att minska antalet databasanrop",
      "Implementera behörighetskontroll för quiz-åtkomst",
      "Lägg till felhantering för autentisering",
      "Testa användarflöde från registrering till quiz-skapande",
      "Implementera sessionslagring och auto-uppdatering",
    ],
  };

	const devlogs = $state([devlog1, devlog2]);
  const func = function() {goto(resolve('/dashboard'))};
	// State
	let currentLog = $state();
	let modal = $state(false);

  /*
    let canvas = $state();
    let ctx = $derived(canvas.getContext("2d"));
    let change = 0;
    onMount(() => {
      
    });

    function draw() {
      const softLinen100 = "oklch(93.31% 0.012 96.43)";
      const softLinen200 = "oklch(86.57% 0.026 94.77)";

      const barWidth = 10;
      const barSpace = barWidth / 3;
      const barAmount = 60;

      ctx.fillStyle = softLinen100;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0,0,1920,200)

      ctx.globalAlpha = 1.0
      ctx.fillStyle = softLinen200;

      for (let i = 0; i < barAmount; i++) {
        const barX = barWidth * i + barSpace * i;
        const barY = Math.sin(change + i / 10) * 200;
        ctx.fillRect(barX, barY, barWidth, 200 - barY);
      }
      change += 0.02;
      requestAnimationFrame(draw);
    }
  */
</script>
<title>Devlogs - Quizmaker.gg</title>

<main class="flex items-center flex-col p-4 gap-4">
  <h1 class="font-bold text-4xl p-4 border-b-2">Devlogs</h1>
  <div class="sticky top-6">
    <Button func={func}>Back to dashboard</Button>
  </div>
  <nav class="overflow-y-scroll flex flex-col gap-4">
    {#each devlogs as log (log.title)}
      <button onclick={() => {currentLog = log; modal = true;}} class="border-2 border-soft-linen-200 dark:border-dusk-blue-800 w-[50vw] rounded p-6 flex justify-between items-center shadow cursor-pointer">
        <div class="w-3/5 text-ellipsis">
          <h2 class="heading">{log.title}</h2>
          <p>{log.summary}...</p>
        </div>
          <img class="w-full h-full object-contain" src={log.image} alt="{log.title} thumbnail">
      </button>
    {/each}
  </nav>

  {#if modal}
    <Modal bind:modalState={modal}>
      <div class="flex flex-col overflow-y-scroll gap-4 w-full max-h-[70vh]">
        <h2 class="heading">{currentLog.title}</h2>
        <span>{currentLog.summary}</span>
        <div class="w-full max-w-md h-48 overflow-hidden rounded shadow-sm">
          <img class="w-full h-full object-contain" src={currentLog.image} alt="{currentLog.title} image">
        </div>
        <h3 class="heading">Vad är nytt?</h3>
        <ul>
          {#each currentLog.updates as update (update)}
            <li class="list-disc list-inside">{update}</li>
          {/each}
        </ul>
        <h3 class="heading">Fokus</h3>
        <p>{currentLog.focus}</p>
        <h3 class="heading">Vad krånglade?</h3>
        <ul>
          {#each currentLog.problems as problem (problem)}
            <li class="list-disc list-inside">{problem}</li>
          {/each}
        </ul>
        <h3 class="heading">Noteringar</h3>
        <p>{currentLog.notes}</p>
        <h3 class="heading">Lärdomar</h3>
        <p>{currentLog.learnings}</p>
        <h3 class="heading">Vad är planen för nästkommande lektioner?</h3>
        <ul>
          {#each currentLog.nextSteps as step (step)}
            <li class="list-disc list-inside">{step}</li>
          {/each}
        </ul>
      </div>
    </Modal>
  {/if}
</main>
<!--
<canvas id="canvas" width="1920" height="400" class="fixed" bind:this={canvas}></canvas>
-->