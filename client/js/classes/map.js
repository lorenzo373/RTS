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
		let tiles = ['grass.png', 'grass2.png', 'rock.png', 'water.png'];

		this.map = [];
		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				if(!this.map[x]) {
					this.map[x] = [];
				}

				this.map[x][y] = 0;

				var texture = PIXI.Texture.fromImage('./assets/' + tiles[Math.floor(Math.random() * tiles.length)]);
				var sprite = new PIXI.Sprite(texture);

				sprite.position.x = x * 64;
				sprite.position.y = y * 64;

				this.scene.addChild(sprite);
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
			//let before = this.getCoordinates(e.clientX, e.clientY);
			//Game.map.scene.updateTransform();
			//let after = this.getCoordinates(e.clientX, e.clientY);

			//Game.map.scene.position.x += (after.x - before.x) * Game.map.scene.scale.x;
			//Game.map.scene.position.y += (after.y - before.y) * Game.map.scene.scale.y;
			//Game.map.scene.updateTransform();
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