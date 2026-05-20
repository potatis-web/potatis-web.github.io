<script>
	import { onMount } from "svelte";

  let canvas = $state();
  let ctx = $derived(canvas.getContext("2d"));
  let screenW;
  let screenH;
  let zoom = $state(1.0);
  
  let mouseX;
  let mouseY;

  let addStage = 'idle';
  let newBodyX = 0;
  let newBodyY = 0;
  let newBodyRadius = 30;

  let bodies = [
    {x: 0, y: 0, radius: 50, velocity: 0, direction: 0},
    {x: 100, y: 0, radius: 25, velocity: 5, direction: -Math.PI / 2 },
  ];

  onMount(() => {
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', mouse);
    resize();
    requestAnimationFrame(draw);
  })

  function addBody() {
    if (addStage === 'idle') {
      addStage = 'pick-position';
      document.addEventListener('click', click);
    }
  }

  

  // Tracking functions
  function resize() {
    screenW = window.innerWidth;
    screenH = window.innerHeight;
    canvas.setAttribute("width", screenW);
    canvas.setAttribute("height", screenH);
  }

  function mouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
  }
  
  function directionToMouse(pointX, pointY) {
    return Math.atan2(mouseY - pointY, mouseX - pointX);
  }

  function click(e) {
    if (addStage === 'pick-position') {
      newBodyX = e.clientX;
      newBodyY = e.clientY;
      addStage = 'pick-direction';
      return;
    }

    if (addStage === 'pick-direction') {
      const direction = directionToMouse(newBodyX, newBodyY);
      bodies.push({
        x: newBodyX - screenW / 2,
        y: newBodyY - screenH / 2,
        radius: newBodyRadius,
        velocity: 5,
        direction,
      });
      addStage = 'idle';
      document.removeEventListener('click', click);
    }
  }

  // Drawing functions
  function circle(x, y, radius, color = 'white', fill = true) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    if (fill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
    
  }

  function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,screenW,screenH);

    ctx.fillStyle = 'orange';
    

    // Drawing bodies
    for (let i = 0; i <= bodies.length - 1; i++) {
      const body = bodies[i];

      body.x += Math.cos(body.direction) * body.velocity;
      body.y += Math.sin(body.direction) * body.velocity;

      body.velocity *= 0.98; 

      const relativeX = body.x * zoom + screenW / 2;
      const relativeY = body.y * zoom + screenH / 2;
      const radius = body.radius * zoom;

      circle(relativeX, relativeY, radius);
    }


    // Draw cursor
    if (addStage !== 'idle') {
      circle(mouseX, mouseY, 2);
      if (addStage === 'pick-direction') {
        circle(newBodyX, newBodyY, 5);
        const a = newBodyY - mouseY;
        const b = newBodyX - mouseX;
        circle(newBodyX, newBodyY, Math.abs(Math.sqrt(a ** 2 + b ** 2)), 'white', false);
      }
    }


    requestAnimationFrame(draw);
  }
</script>

<canvas bind:this={canvas} ></canvas>

<div class="fixed bottom-4 left-4 *:border-white *:border">
  <button class="cursor-pointer p-4 " onclick={addBody}> Add</button>
</div>

<!--Bottom Right-->
<div class="fixed bottom-4 right-4 flex items-center gap-2 *:border-white *:border">
  <p>Zoom: {zoom.toFixed(1)}x</p>
  <button class="cursor-pointer p-4" onclick={() => zoom += 0.1}>+</button>
  <button class="cursor-pointer p-4 " onclick={() => zoom -= 0.1}>-</button>
</div>