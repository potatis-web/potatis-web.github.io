<script>
	import { onMount } from 'svelte';

	class Vector2 {
		constructor(x = 0, y = 0) {
			this.x = x;
			this.y = y;
		}

		get length() {
			return Math.hypot(this.x, this.y);
		}

		get angle() {
			return Math.atan2(this.y, this.x);
		}

		add(a, b = a) {
			if (a instanceof Vector2) {
				this.x += a.x;
				this.y += a.y;
			} else {
				this.x += a;
				this.y += b;
			}
			return this;
		}

		subtract(a, b = a) {
			if (a instanceof Vector2) {
				this.x -= a.x;
				this.y -= a.y;
			} else {
				this.x -= a;
				this.y -= b;
			}
			return this;
		}

		multiply(a, b = a) {
			if (a instanceof Vector2) {
				this.x *= a.x;
				this.y *= a.y;
			} else {
				this.x *= a;
				this.y *= b;
			}
			return this;
		}

		clone() {
			return new Vector2(this.x, this.y);
		}

		toString() {
			return `(${this.x}, ${this.y})`;
		}

		normalize() {
			const length = this.length;
			if (length === 0) return new Vector2(0, 0);
			return new Vector2(this.x / length, this.y / length);
		}
	}

	class Body {
		constructor(position = new Vector2(), mass, radius, velocity = 0, direction = 0) {
			// Position
			this.x = position.x;
			this.y = position.y;

			// Physical properties
			this.mass = mass;
			this.radius = radius;
			this.volume = (4 / 3) * Math.PI * this.radius ** 3;
			this.density = mass / this.volume;

			// Movement
			this.velocity = velocity;
			this.direction = direction;
		}

		update() {
			this.x += Math.cos(this.direction) * this.velocity;
			this.y += Math.sin(this.direction) * this.velocity;
		}

		draw() {

		}
	}
	
	let canvas = $state();
	let ctx = $derived(canvas?.getContext('2d'));
  let screen = $state(new Vector2(0, 0));
  let camera = $state(new Vector2(screen.x / 2, screen.y / 2));
	let zoom = $state(1.0);
  let mouse = $state(new Vector2(0, 0));
	let isDragging = false;
	let dragStart = new Vector2();
	let cameraStart = new Vector2;
	let bodies = $state([
		new Body(new Vector2(100,100),100,50),
	]);
	let keysPressed = {
		arrowLeft: false,
		arrowRight: false,
		arrowUp: false,
		arrowDown: false,
	}

	// Functions
	function directionToMouse(vector) {
		return Math.atan2(mouse.y - vector.y, mouse.x - vector.x);
	}

	function distanceToMouse(vector) {
		return Math.hypot(vector.x - mouse.x, vector.y - mouse.y);
	}

	function resize() {
		screen.x = window.innerWidth;
		screen.y = window.innerHeight;
		canvas.setAttribute('width', screen.x);
		canvas.setAttribute('height', screen.y);
	}

	function handleMouseMove(event) {
		const currentMouse = new Vector2(event.clientX, event.clientY)
		mouse = currentMouse;

		if (isDragging) {
			const delta = currentMouse.clone().subtract(dragStart)
			camera.x = cameraStart.x - delta.x
			camera.y = cameraStart.y - delta.y
		}
	}
	function handleMouseDown(event) {
		isDragging = true
		dragStart = new Vector2(event.clientX, event.clientY)
		cameraStart = camera.clone()
	}

	function handleMouseUp() {
		isDragging = false
	}

	function handleKeydown(event) {
		if (event.key === "ArrowLeft") {
			keysPressed.arrowLeft === true;
		}
		if (event.key === "ArrowRight") {
			keysPressed.arrowRight === true;
		}
		if (event.key === "ArrowUp") {
			keysPressed.arrowUp === true;
		}
		if (event.key === "ArrowDown") {
			keysPressed.arrowDown === true;
		}
	}

	function handleKeyUp(event) {
		if (event.key === "ArrowLeft") {
			keysPressed.arrowLeft === false;
		}
		if (event.key === "ArrowRight") {
			keysPressed.arrowRight === false;
		}
		if (event.key === "ArrowUp") {
			keysPressed.arrowUp === false;
		}
		if (event.key === "ArrowDown") {
			keysPressed.arrowDown === false;
		}
	}
	
	
	function drawCircle(x, y, radius, fill = true, color = 'white') {
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);

		if (fill) {
			ctx.fill();
		} else {
			ctx.stroke();
		}
	}
  
  function drawRect(position, size, color = 'gray') {
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, size.x, size.y)
  }

	function drawBodies() {
		for (let i = 0; i < bodies.length; i++) {
			const body = bodies[i];
			drawCircle(body.x, body.y, body.radius)
		}
	}

	function draw() {
		if (!ctx) return

		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, screen.x, screen.y)

		ctx.save()
		ctx.translate(-camera.x, -camera.y)

		drawBodies()

		ctx.restore()

		requestAnimationFrame(draw)
	}

	// ========================================
	// LIFECYCLE
	// ========================================

	onMount(() => {
		// Canvas is now bound, safe to use
		if (!canvas) return;

		window.addEventListener('resize', resize);
		document.addEventListener('mousemove', handleMouseMove);

		resize();
		requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('resize', resize);
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>
<main class="text-white">
  <canvas bind:this={canvas} class={`cursor-grab active:cursor-grabbing`}></canvas>

	<!--Top Right-->
	<div class="fixed top-4 right-4">
		<p class="text-neutral-500">Mouse (Screen): {mouse.x}, {mouse.y}</p>
		<p class="text-neutral-500">Mouse (Camera): {mouse.x - camera.x}, {mouse.y-camera.y}</p>
		<p class="text-neutral-500">Camera: {camera.x}, {camera.y}</p>
	</div>

  <!--Bottom Left-->
  <div class="fixed bottom-4 left-4 flex items-center gap-2 *:border *:p-4 *:rounded">
    <button class="cursor-pointer" onclick={()=>{}}> Add</button>
  </div>

  <!--Bottom Right-->
  <div class="fixed bottom-4 right-4 flex items-center gap-2  *:border *:p-4 *:rounded">
    <p>Zoom: {zoom.toFixed(2)}x</p>
    <button class="cursor-pointer" onclick={()=>{}}>+</button>
    <button class="cursor-pointer " onclick={()=>{}}>-</button>
  </div>
</main>
<svelte:window onkeydown={handleKeydown} onkeyup={handleKeyUp} onmousedown={handleMouseDown} onmousemove={handleMouseMove} onmouseup={handleMouseUp} />