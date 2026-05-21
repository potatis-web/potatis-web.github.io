<script>
	import { onMount } from "svelte";

  let canvas = $state();
  let ctx = $derived(canvas.getContext("2d"));
  let screenW;
  let screenH;

  let cameraX = $derived(screenW / 2)
  let cameraY = $derived(screenH / 2)

  let zoom = $state(1.0);
  
  let mouseX;
  let mouseY;

  let addStage = 'idle';
  let newBody = $state({});

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
      canvas.addEventListener('click', click);
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

  function distanceToMouse(pointX, pointY) {
    const a = pointX - mouseX;
    const b = pointY - mouseY;
    return Math.sqrt(a * a + b * b);
  }

  function click(event) {
    if (addStage === 'pick-position') {
      newBody.x = event.clientX;
      newBody.y = event.clientY;
      addStage = 'pick-radius';
      return;
    }

    if (addStage === 'pick-radius') {
      newBody.radius = distanceToMouse(newBody.x, newBody.y);
      addStage = 'pick-direction';
      return;
    }

    if (addStage === 'pick-direction') {
      newBody.direction = directionToMouse(newBody.x, newBody.y);
      newBody.velocity = distanceToMouse(newBody.x, newBody.y) / 10;

      const body = {
        x: newBody.x - cameraX,
        y: newBody.y - cameraY,
        radius: newBody.radius,
        direction: newBody.direction,
        velocity: newBody.velocity,
      };

      bodies.push(body);
      canvas.removeEventListener('click', click);
      newBody = {};
      addStage = 'idle';
    }
  }

  // Drawing functions
  function circle(x, y, radius,  fill = true, color = 'white') {
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
    

    // Drawing bodies
    for (let i = 0; i <= bodies.length - 1; i++) {
      const body = bodies[i];

      

      body.velocity *= 0.99; 

      const relativeX = body.x * zoom + cameraX;
      const relativeY = body.y * zoom + cameraY;
      const radius = body.radius * zoom;

      body.x += Math.cos(body.direction) * body.velocity;
      body.y += Math.sin(body.direction) * body.velocity;

      if (distanceToMouse(relativeX, relativeY) <= radius) {
        circle(relativeX, relativeY, radius + 5, false, 'blue')
      }
      

      circle(relativeX, relativeY, radius);
    }


    // Draw cursor
    if (addStage !== 'idle') {
      circle(mouseX, mouseY, 3);
    }
    if (newBody?.x) {
      circle(newBody.x, newBody.y, 5)
      circle(newBody.x, newBody.y, newBody?.radius ?? distanceToMouse(newBody.x, newBody.y), false)
    }
    if (newBody?.radius) {
      ctx.beginPath();
      ctx.moveTo(newBody.x, newBody.y);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }
</script>

<canvas bind:this={canvas} ></canvas>

<!--Bottom Left-->
<div class="fixed bottom-4 left-4 *:border-white *:border">
  <button class="cursor-pointer p-4 " onclick={addBody}> Add</button>
  <p>Position: {newBody.x} {newBody.y}</p>

</div>

<!--Bottom Right-->
<div class="fixed bottom-4 right-4 flex items-center gap-2 *:border-white *:border">
  <p>Zoom: {zoom.toFixed(1)}x</p>
  <button class="cursor-pointer p-4" onclick={() => zoom += 0.1}>+</button>
  <button class="cursor-pointer p-4 " onclick={() => zoom -= 0.1}>-</button>
</div>