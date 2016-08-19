class Map {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.generator = 'PERLIN';
		this.noise = {
			x: 45,
			y: 45
		};

		// Load map
		this.load();

		// Init events
		this.initEvents();
	}

	load() {
		let waterTiles = ['water.png', 'water2.png'];
		let sandTiles = ['sand.png', 'sand2.png'];
		let grassTiles = ['grass.png', 'grass2.png'];
		let taigaTiles = ['taiga.png', 'taiga2.png'];
		let rockTiles = ['rock.png', 'rock2.png'];
		let snowTiles = ['snow.png', 'snow2.png'];
		let trees = ['tree4.png', 'tree5.png', 'tree6.png'];

		var pos;
		var scale;
		if(this.scene) {
			pos = this.scene.position;
			scale = this.scene.scale;
		}

		Game.sceneHandler.destroyScene('map');
		this.scene = Game.sceneHandler.createScene('map', true, 0);

		if(pos) {
			this.scene.position = pos;
			this.scene.scale = scale;
		}

		delete this.map;
		this.map = [];

		noise.seed(Math.random());

		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				if(!this.map[x]) {
					this.map[x] = [];
				}

				if(this.generator == 'PERLIN') {
					var value = Math.abs(noise.perlin2(x / this.noise.x, y / this.noise.y));
				} else {
					var value = Math.abs(noise.simplex2(x / this.noise.x, y / this.noise.y));
				}

				var tileName;
				if(value < 0.08) tileName = 'ocean.png';
				else if(value < 0.15) tileName = tileName = waterTiles[Math.floor(Math.random() * waterTiles.length)];
				else if(value < 0.35) tileName = sandTiles[Math.floor(Math.random() * sandTiles.length)];
				else if(value < 0.55) tileName = grassTiles[Math.floor(Math.random() * grassTiles.length)];
				else if(value < 0.75) tileName = taigaTiles[Math.floor(Math.random() * taigaTiles.length)];
				else if(value < 0.90) tileName = rockTiles[Math.floor(Math.random() * rockTiles.length)];
				else tileName = snowTiles[Math.floor(Math.random() * snowTiles.length)];

				var texture = PIXI.Texture.fromImage('./assets/' + tileName);
				var sprite = new PIXI.Sprite(texture);

				sprite.position.x = x * 64;
				sprite.position.y = y * 64;

				this.scene.addChild(sprite);

				if(value > 0.35 && value < 0.50) {
					var rand = Math.floor(Math.random() * 100);

					if(rand > 75) {
						var treeText = PIXI.Texture.fromImage('./assets/' + trees[Math.floor(Math.random() * trees.length)]);
						var tree = new PIXI.Sprite(treeText);

						tree.position.x = x * 64;
						tree.position.y = y * 64;

						this.scene.addChild(tree);
					}
				}

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


			if((direction == -1 && Game.map.scene.scale.x > 0.15) || (direction == 1 && Game.map.scene.scale.x < 1.85)) {
				Game.map.scene.scale.x *= factor;
				Game.map.scene.scale.y *= factor;
			}

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