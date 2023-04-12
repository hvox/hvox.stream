function modulo(x, y) {
	return (x % y + y) % y;
}

function merge(u, v, alpha) {
	let result = [];
	let length = Math.min(u.length, v.length);
	for (var i = 0; i < length; i++)
		result.push(Math.round(u[i] + (v[i] - u[i]) * alpha));
	return result;
}

window.onload = function() {
	let CANVAS_SIZE = 360;
	let GRID_SIZE = 15;
	let ARROW_KEYS = {
		"ArrowUp": {y: -1}, "ArrowLeft": {x: -1}, "ArrowDown": {y: 1}, "ArrowRight": {x: 1},
		"KeyW": {y: -1}, "KeyA": {x: -1}, "KeyS": {y: +1}, "KeyD": {x: +1},
		"KeyI": {y: -1}, "KeyJ": {x: -1}, "KeyK": {y: +1}, "KeyL": {x: +1},
	};
	let DEFAULT_SNAKE_SIZE = 4;

    let cvs = document.getElementById("canvas");
	cvs.width = cvs.height = CANVAS_SIZE;
    let ctx = cvs.getContext("2d");
	let cs = CANVAS_SIZE / GRID_SIZE | 0;
	let snake = {x: GRID_SIZE / 2 | 0, y: GRID_SIZE / 2 | 0, direction: {x: 0, y: 0}};
	let apple = {x: GRID_SIZE * 3 / 4 | 0, y: GRID_SIZE * 3 / 4 | 0};
	let tail = [];
	for (var i = 0; i < DEFAULT_SNAKE_SIZE; i++) tail.push({x: snake.x, y: snake.y});
	let eaten_tail = [];
	let grid_colors = [];
	for (var y = 0; y < GRID_SIZE; y++) {
		let grid_colors_row = [];
		for (var x = 0; x < GRID_SIZE; x++) {
			let color = merge([43, 43, 54], [23, 24, 34], Math.random());
			grid_colors_row.push("rgb(" + color[0] + "," + color[1] + "," + color[2] + ")");
		}
		grid_colors.push(grid_colors_row);
	}
    document.addEventListener("keydown", (event) => {
		snake.direction = ARROW_KEYS[event.code] ?? snake.direction;
	});
	function render() {
		ctx.fillStyle = "#151621";
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		for (var x = 0; x < GRID_SIZE; x++) for (var y = 0; y < GRID_SIZE; y++) {
			ctx.fillStyle = grid_colors[y][x];
			ctx.fillRect(1 + x * cs, 1 + y * cs, cs - 2, cs - 2);
		}
		ctx.fillStyle = "#00880055";
		for (var i = 0; i < eaten_tail.length; i++)
			ctx.fillRect(1 + eaten_tail[i].x * cs, 1 + eaten_tail[i].y * cs, cs - 2, cs - 2);
		ctx.fillStyle = "#00ff00";
		for (var i = 0; i < tail.length; i++)
			ctx.fillRect(1 + tail[i].x * cs, 1 + tail[i].y * cs, cs - 2, cs - 2);
		ctx.fillStyle = "#ff0000";
		ctx.fillRect(1 + apple.x * cs, 1 + apple.y * cs, cs - 2, cs - 2);
	}
	function tick() {
		if (!snake.direction.x && !snake.direction.y) return;
		snake.x += snake.direction.x ?? 0;
		snake.y += snake.direction.y ?? 0;
		if (snake.x >= GRID_SIZE) { snake.x = 0; snake.y -= 7; }
		if (snake.x < 0) { snake.x = GRID_SIZE - 1; snake.y += 7; }
		snake.y = modulo(snake.y, GRID_SIZE);

		if (apple.x == snake.x && apple.y == snake.y) {
			// TODO: while apple in snake
			apple.x = Math.floor(Math.random() * GRID_SIZE);
			apple.y = Math.floor(Math.random() * GRID_SIZE);
		} else {
			tail.shift();
		}
		for (var i = 0; i < tail.length; i++) {
			if (tail[i].x != snake.x || tail[i].y != snake.y)
				continue;
			eaten_tail = eaten_tail.concat(tail.slice(0, i));
			tail = tail.slice(i);
		}
		tail.push({x: snake.x, y: snake.y});
	}
    setInterval(() => {
		tick();
		render();
	}, 1000 / 16);
}
