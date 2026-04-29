<script>
  import { onMount } from "svelte";
  let data = $state({
    screen: {
      x: null,
      y: null,
    },
    map: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,0,0,1,0,1],
      [1,0,0,0,1,1,0,0, 0,1],
      [1,0,1,0,0,1,0,1,0,1],
      [1,0,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1],
    ],
    player: {
      x: 2.5,
      y: 2.5,
      velocity: 0,
      ang: 0,
    },
    keys: {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    }
  })
  onMount(() => {
    draw();
    getSize();

    document.addEventListener('resize', getSize);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp)
  })

  function draw() {
    // Get constants
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Process input

    const moveSpeed = 0.04
    const lookSpeed = 0.05

    data.player.ang = data.keys.ArrowLeft ? (data.player.ang - lookSpeed) % (Math.PI * 2) : data.player.ang;
    data.player.ang = data.keys.ArrowRight ? (data.player.ang + lookSpeed + Math.PI * 2) % (Math.PI * 2) : data.player.ang;

    data.player.x = data.keys.ArrowUp ? data.player.x + Math.cos(data.player.ang) * moveSpeed : data.player.x;
    data.player.y = data.keys.ArrowUp ? data.player.y + Math.sin(data.player.ang) * moveSpeed : data.player.y

    // Fullscreen
    canvas.width = data.screen.x;
    canvas.height = data.screen.y;

    // Set screen to dark
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, data.screen.x, data.screen.y);

    const mapSize = 25;
    renderRaycasterView(ctx);

    // Draw map in top right
    for (let y = 0; y < data.map.length; y++) {
      for (let x = 0; x < 10; x++) { // Assumes every array is 10 in length
        if (data.map[y][x]) {
          ctx.fillStyle = "#444";
          ctx.fillRect(x * mapSize, y * mapSize, mapSize - mapSize * 0.05, mapSize - mapSize * 0.05);
        } 
        else {
          continue;
        }
      }
    }

    const playerSize = 5

    // Draw player in top right
    ctx.fillStyle = "#aaa";
    ctx.beginPath();
    ctx.arc(data.player.x * mapSize, data.player.y * mapSize, playerSize, 0, Math.PI * 2)
    ctx.fill()


    // Direction indicator
    const lineLength = 10
    
    ctx.strokeStyle = "#bbb";
    ctx.beginPath();
    ctx.moveTo(data.player.x * mapSize, data.player.y * mapSize)

    ctx.lineWidth = 2;
    ctx.lineTo(data.player.x * mapSize + lineLength * Math.cos(data.player.ang), data.player.y * mapSize + lineLength * Math.sin(data.player.ang));
    ctx.stroke();
    requestAnimationFrame(draw);
  }

  function getSize() {
    data.screen.x = window.innerWidth;
    data.screen.y = window.innerHeight;
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
        data.keys.ArrowLeft = true;
        break;
      case "ArrowRight":
        data.keys.ArrowRight = true;

        break;
      case "ArrowUp":
        data.keys.ArrowUp = true;
        break;
      default:
        return;
    }
  }
  function handleKeyUp(event) {
    switch (event.key) {
      case "ArrowLeft":
        data.keys.ArrowLeft = false;
        break;
      case "ArrowRight":
        data.keys.ArrowRight = false;
        break;
      case "ArrowUp":
        data.keys.ArrowUp = false;
        break;
    }
  }
  function castRay(playerX, playerY, angle) {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let mapX = Math.floor(playerX);
    let mapY = Math.floor(playerY);

    const deltaDistX = Math.abs(1 / dx);
    const deltaDistY = Math.abs(1 / dy);

    let stepX, stepY;
    let sideDistX, sideDistY;

    // step direction + initial distance
    if (dx < 0) {
      stepX = -1;
      sideDistX = (playerX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - playerX) * deltaDistX;
    }

    if (dy < 0) {
      stepY = -1;
      sideDistY = (playerY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - playerY) * deltaDistY;
    }

    let hit = false;
    let side; // was it a vertical or horizontal wall?

    while (!hit) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      // bounds check
      if (
        mapX < 0 || mapX >= data.map[0].length ||
        mapY < 0 || mapY >= data.map.length
      ) {
        return 50; // max distance fallback
      }

      if (data.map[mapY][mapX] === 1) {
        hit = true;
      }
    }

    // calculate distance
    let distance;
    if (side === 0) {
      distance = (mapX - playerX + (1 - stepX) / 2) / dx;
    } else {
      distance = (mapY - playerY + (1 - stepY) / 2) / dy;
    }

    return { distance: Math.abs(distance), side };
  }



  function renderRaycasterView(ctx) {

    const rayCount = data.screen.x; // One ray per pixel column

    const fov = Math.PI / 3; // 60 degree field of view

    const wallHeight = data.screen.y * 0.7; // Max wall height

    

    // Fill ceiling and floor

    ctx.fillStyle = "#222";

    ctx.fillRect(0, 0, data.screen.x, data.screen.y / 2);

    ctx.fillStyle = "#444";

    ctx.fillRect(0, data.screen.y / 2, data.screen.x, data.screen.y / 2);

    

    // Cast rays and draw walls

    for (let i = 0; i < rayCount; i++) {

      // Calculate ray angle

      const rayAngle = (data.player.ang - fov / 2) + (i / rayCount) * fov;

      

      // Get distance to wall

      const { distance, side } = castRay(data.player.x, data.player.y, rayAngle);
      
      const correctedDistance = distance * Math.cos(rayAngle - data.player.ang);
      
      const shade = side === 1 ? 0.7 : 1;
      ctx.fillStyle = `hsl(0, 0%, ${Math.max(10, (100 - correctedDistance * 8) * shade)}%)`;
      

      // Fix fish-eye distortion

      

      

      // Calculate wall height based on distance

      const wallHeightOnScreen = correctedDistance > 0 ? wallHeight / correctedDistance : 0;

      

      // Draw vertical wall slice

      ctx.fillStyle = `hsl(0, 0%, ${Math.max(10, 100 - correctedDistance * 8)}%)`;

      const wallTop = (data.screen.y - wallHeightOnScreen) / 2;

      ctx.fillRect(i, wallTop, 1, wallHeightOnScreen);

    }

  }
</script>

<canvas id="canvas"></canvas>
<svelte:window></svelte:window>