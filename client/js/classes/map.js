class Map {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.generator = 'PERLIN';
		this.noise = new Vector2(45, 45);

		// Load map
		this.load();

		// Init events
		this.initEvents();
	}

	load() {
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

				var tile;
				if(value < 0.08) tile = new Tile(TILES.OCEAN);
				else if(value < 0.15) tile = new Tile(TILES.WATER);
				else if(value < 0.35) tile = new Tile(TILES.SAND);
				else if(value < 0.55) tile = new Tile(TILES.GRASS);
				else if(value < 0.75) tile = new Tile(TILES.TAIGA);
				else if(value < 0.90) tile = new Tile(TILES.ROCK);
				else tile = new Tile(TILES.SNOW);

				tile.sprite.position.x = x * TILESIZE;
				tile.sprite.position.y = y * TILESIZE;

				this.scene.addChild(tile.sprite);

				this.generateTree(value, x, y);

				this.map[x][y] = tile;
			}
		}
	}

	generateTree(value, x, y) {
		// Trees
		if(value > 0.35 && value < 0.50) {
			var rand = Math.floor(Math.random() * 100);

			if(rand > 75) {
				var treeText = Game.assets.getAsset(TREES.NORMAL[Math.floor(Math.random() * TREES.NORMAL.length)]);
				var tree = new PIXI.Sprite(treeText);

				tree.position.x = x * TILESIZE;
				tree.position.y = y * TILESIZE;

				this.scene.addChild(tree);
			}
		}

		// Palms
		if(value > 0.16 && value < 0.20) {
			var rand = Math.floor(Math.random() * 100);

			if(rand > 90) {
				var palmText = Game.assets.getAsset(TREES.PALMS[Math.floor(Math.random() * TREES.PALMS.length)]);
				var palm = new PIXI.Sprite(palmText);

				palm.position.x = x * TILESIZE;
				palm.position.y = y * TILESIZE;

				this.scene.addChild(palm);
			}
		}
	}

	initEvents() {
		Game.input.onMouseDown('mapDrag', e => {
			// Left mouse button
			if(e.which === 1) {
				console.log(Game.map.getTileForRealPosition(new Vector2(e.clientX, e.clientY)).type.name);
			}

			// Right mouse button
			if(e.which === 3) {
				Game.map.isDragging = true;
				Game.map.lastDrag = { x: e.clientX, y: e.clientY };
			}
		});

		Game.input.onMouseUp('mapDrag', e => {
			// Left mouse button
			if(e.which === 1) {
				let mousePosition = this.getCoordinates(new Vector2(e.clientX, e.clientY));

				let tilePosition = this.nearestTileWorldPosition(mousePosition);

				new Building(tilePosition.x, tilePosition.y, 'command');
			}

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
			let before = this.getCoordinates(new Vector2(e.clientX, e.clientY));
			Game.map.scene.updateTransform();
			let after = this.getCoordinates(new Vector2(e.clientX, e.clientY));

			Game.map.scene.position.x += (after.x - before.x) * Game.map.scene.scale.x;
			Game.map.scene.position.y += (after.y - before.y) * Game.map.scene.scale.y;
			Game.map.scene.updateTransform();
		});
	}

	getTileForMapPosition(vec2) {
		return this.map[vec2.x][vec2.y];
	}

	getTileForRealPosition(vec2) {
		var _x = 1 / this.scene.scale.x;
		var _y = 1 / this.scene.scale.y;

		var xx = vec2.x * _x - (_x * this.scene.position.x);
		var yy = vec2.y * _y - (_y * this.scene.position.y);

		var fx = Math.floor(xx / TILESIZE);
		var fy = Math.floor(yy / TILESIZE);

		return this.map[fx][fy];
	}

	getCoordinates(vec2) {
		return PIXI.interaction.InteractionData.prototype.getLocalPosition.call({
			global: {
				x: vec2.x,
				y: vec2.y
			}
		}, Game.map.scene);
	}

	nearestTileWorldPosition(vec2) {
		return new Vector2(Math.floor(vec2.x / TILESIZE) * TILESIZE, Math.floor(vec2.y / TILESIZE) * TILESIZE);
	}
}