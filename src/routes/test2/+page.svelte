<script>
		import { onMount } from 'svelte';
 
	// ========================================
	// UTILITY CLASSES (defined first!)
	// ========================================
 
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

		dot(Vector2) {

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

      // Apply friction
			this.velocity *= 0.99;
		}
	}
 
	// ========================================
	// STATE MANAGEMENT
	// ========================================
 
	let canvas = $state();
	let ctx = $derived(canvas?.getContext('2d'));
 
	// Canvas dimensions
  let screen = $state(new Vector2(0, 0));
 
	// Camera/zoom
  let camera = $state(new Vector2(screen.x / 2, screen.y / 2))

	let zoom = $state(1.0);
 
	// Input tracking
  let mouse = $state(new Vector2(0, 0 ))
 
	// Body addition workflow state
	let addStage = $state('idle'); // 'idle' | 'pick-position' | 'pick-radius' | 'pick-direction'
	let newBody = $state({});
 
	// Physics bodies
	let bodies = $state([
		new Body(new Vector2(0, 0), 1000, 50, 0, 0),
		new Body(new Vector2(100, 0), 250, 25, 10, -Math.PI / 2),
		new Body(new Vector2(-100, 100), 100, 10)
	]);
 
	// ========================================
	// MATH UTILITIES
	// ========================================
 
	function directionToMouse(pointX, pointY) {
		return Math.atan2(mouse.y - pointY, mouse.x - pointX);
	}
 
	function distanceToMouse(point) {
		return Math.hypot(point.x - mouse.x, point.y - mouse.y);
	}
 
	// ========================================
	// EVENT HANDLERS
	// ========================================
 
	function resize() {
		screen.x = window.innerWidth;
		screen.y = window.innerHeight;
		canvas.setAttribute('width', screen.x);
		canvas.setAttribute('height', screen.y);
	}
 
	function handleMouseMove(e) {
		mouse = new Vector2(e.clientX, e.clientY);
	}
 
	function handleAddBody() {
		if (addStage === 'idle') {
			addStage = 'pick-position';
			canvas.addEventListener('click', handleCanvasClick);
		}
	}
 
	function handleCanvasClick(event) {
		if (addStage === 'pick-position') {
			newBody = { x: event.clientX, y: event.clientY };
			addStage = 'pick-radius';
			return;
		}
 
		if (addStage === 'pick-radius') {
			newBody.radius = distanceToMouse(new Vector2(newBody.x, newBody.y));
			addStage = 'pick-direction';
			return;
		}
 
		if (addStage === 'pick-direction') {
			newBody.direction = directionToMouse(new Vector2(newBody.x, newBody.y));
			newBody.velocity = distanceToMouse(new Vector2(newBody.x, newBody.y)) / 10;
 
			// Create body in world space
			const body = new Body(new Vector2(newBody.x - camera.x, newBody.y - camera.y), 100, newBody.radius, newBody.velocity, newBody.direction)
      

			bodies.push(body);
			canvas.removeEventListener('click', handleCanvasClick);
 
			// Reset state
			newBody = {};
			addStage = 'idle';
		}
	}
 
	// ========================================
	// RENDERING
	// ========================================
 
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
 

 
			// Calculate screen position
			const relativeX = body.x * zoom + camera.y;
			const relativeY = body.y * zoom + camera.y;
			const radius = body.radius * zoom;
 
			// Update position
      body.update()
 
			
 
			// Draw body
			drawCircle(relativeX, relativeY, radius);

			// Highlight if hovered
			if (distanceToMouse(relativeX, relativeY) <= radius) {
				drawCircle(relativeX, relativeY, radius + 3, false, 'blue');
				drawRect(mouse, new Vector2(100, 100), 'gray')
			}
		}
	}
 
	function drawAddStageUI() {
		// Draw cursor marker
		if (addStage !== 'idle') {
			drawCircle(mouse.x, mouse.y, 3);
		}
 
		// Draw new body position marker
		if (newBody?.x) {
			drawCircle(newBody.x, newBody.y, 5);
			drawCircle(newBody.x, newBody.y, newBody?.radius ?? distanceToMouse(newBody.x, newBody.y), false);
		}
 
		// Draw direction line
		if (newBody?.radius) {
			ctx.beginPath();
			ctx.moveTo(newBody.x, newBody.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
		}
	}
 
	function draw() {
		if (!ctx) return;
 
		// Clear canvas
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, screen.x, screen.y);
 
		// Update and render bodies
		drawBodies();
 
		// Draw UI for adding bodies
		drawAddStageUI();
 
		// Continue animation loop
		requestAnimationFrame(draw);
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
  <canvas bind:this={canvas} ></canvas>

  <!--Bottom Left-->
  <div class="fixed bottom-4 left-4 flex items-center gap-2  *:border">
    <button class="cursor-pointer p-4 " onclick={handleAddBody}> Add</button>
    <p>Position: {newBody?.x ?? mouse.x}, {newBody?.y ?? mouse.y}</p>
		<p>Radius: {(newBody?.radius ?? distanceToMouse(new Vector2(newBody.x, newBody.y))).toFixed(1)}</p>

  </div>

  <!--Bottom Right-->
  <div class="fixed bottom-4 right-4 flex items-center gap-2  *:border">
    <p>Zoom: {zoom.toFixed(1)}x</p>
    <button class="cursor-pointer p-4" onclick={() => zoom += 0.1}>+</button>
    <button class="cursor-pointer p-4 " onclick={() => zoom -= 0.1}>-</button>
  </div>
</main>