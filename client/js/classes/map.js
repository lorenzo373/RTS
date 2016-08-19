class Map {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		// Create map scene
		this.scene = Game.sceneHandler.createScene('map', true, 0);

		// Load map
		this.load();

		// Init events
		this.initEvents();
	}

	load() {
		let waterTiles = ['water.png', 'water2.png'];
		let sandTiles = ['sand.png', 'sand2.png'];
		let grassTiles = ['grass.png', 'grass2.png'];
		let rockTiles = ['rock.png', 'rock2.png'];

		noise.seed(Math.random());
		this.map = [];
		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				if(!this.map[x]) {
					this.map[x] = [];
				}

				if(x % 100 === 0) {
					//noise.seed(Math.random());
				}

				var value = Math.abs(noise.simplex2(x / 25, y / 25));
				var tile;

				if(value < 0.15) tile = waterTiles[Math.floor(Math.random() * waterTiles.length)];
				else if(value < 0.35) tile = sandTiles[Math.floor(Math.random() * sandTiles.length)];
				else if(value < 0.75) tile = grassTiles[Math.floor(Math.random() * grassTiles.length)];
				else tile = rockTiles[Math.floor(Math.random() * rockTiles.length)];

				var texture = PIXI.Texture.fromImage('./assets/' + tile);
				var sprite = new PIXI.Sprite(texture);

				sprite.position.x = x * 64;
				sprite.position.y = y * 64;

				this.scene.addChild(sprite);
				this.map[x][y] = value;
			}
		}
	}

	initEvents() {
		Game.input.onMouseDown('mapDrag', e => {
			// Right mouse button
			if(e.which === 3) {
				Game.map.isDragging = true;
				Game.map.lastDrag = { x: e.clientX, y: e.clientY };
			}
		});

		Game.input.onMouseUp('mapDrag', e => {
			// Right mouse button
			if(e.which === 3) {
				Game.map.isDragging = false;
			}
		});

		Game.input.onMouseMove('mapDrag', e => {
			if(Game.map.isDragging) {
				Game.map.scene.position.x += e.clientX - Game.map.lastDrag.x;
				Game.map.scene.position.y += e.clientY - Game.map.lastDrag.y;
				Game.map.lastDrag = { x: e.clientX, y: e.clientY };
			}
		});

		Game.input.onMouseWheel('mapZoom', e => {
			let direction = (e.deltaY < 0) ? 1 : -1;
			let factor = (1 + direction * 0.1);

			Game.map.scene.scale.x *= factor;
			Game.map.scene.scale.y *= factor;

			// Zoom in on mouse position
			// Broken updatetransform, fix in future
			let before = this.getCoordinates(e.clientX, e.clientY);
			Game.map.scene.updateTransform();
			let after = this.getCoordinates(e.clientX, e.clientY);

			Game.map.scene.position.x += (after.x - before.x) * Game.map.scene.scale.x;
			Game.map.scene.position.y += (after.y - before.y) * Game.map.scene.scale.y;
			Game.map.scene.updateTransform();
		});
	}

	getCoordinates(x, y) {
		return PIXI.interaction.InteractionData.prototype.getLocalPosition.call({
			global: {
				x: x,
				y: y
			}
		}, Game.map.scene);
	}
}