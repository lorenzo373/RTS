class Map {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.map = [];
		this.shadows = [];
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
				tile.sprite.displayGroup = new PIXI.DisplayGroup(0, false);

				this.scene.addChild(tile.sprite);

				this.generateTree(value, x, y);

				this.map[x][y] = tile;
			}
		}

		this.cul();
	}

	generateTree(value, x, y) {
		// Trees
		if(value > 0.35 && value < 0.50) {
			var rand = Math.floor(Math.random() * 100);

			if(rand > 75) {
				var treeText = Game.assets.getAsset(TREES.NORMAL[Math.floor(Math.random() * TREES.NORMAL.length)]);
				var tree = new PIXI.Sprite(treeText);
				tree.tint = Game.assets.randomTint(40);
				tree.displayGroup = new PIXI.DisplayGroup(3, false);

				tree.position.x = x * TILESIZE;
				tree.position.y = y * TILESIZE;

				var shadow = new PIXI.Sprite(treeText);
				shadow.tint = 0x000000;
				shadow.alpha = 0.3;
				shadow.displayGroup = new PIXI.DisplayGroup(1, false);

				shadow.position = tree.position;
				shadow.position.x += SHADOWOFFSET.x;
				shadow.position.y += SHADOWOFFSET.y;

				this.scene.addChild(shadow);
				this.scene.addChild(tree);
				this.shadows.push(shadow);
			}
		}

		// Palms
		if(value > 0.16 && value < 0.20) {
			var rand = Math.floor(Math.random() * 100);

			if(rand > 90) {
				var palmText = Game.assets.getAsset(TREES.PALMS[Math.floor(Math.random() * TREES.PALMS.length)]);
				var palm = new PIXI.Sprite(palmText);
				palm.tint = Game.assets.randomTint(40);
				palm.displayGroup = new PIXI.DisplayGroup(3, false);

				palm.position.x = x * TILESIZE;
				palm.position.y = y * TILESIZE;

				var shadow = new PIXI.Sprite(palmText);
				shadow.tint = '000000';
				shadow.alpha = 0.3;
				shadow.displayGroup = new PIXI.DisplayGroup(1, false);

				shadow.position = palm.position;
				shadow.position.x += SHADOWOFFSET.x;
				shadow.position.y += SHADOWOFFSET.y;

				this.scene.addChild(shadow);
				this.scene.addChild(palm);
				this.shadows.push(shadow);
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

				Game.map.cul();
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

			Game.map.cul();
		});
	}

	cul() {
		let TL = this.getTileForRealPosition(new Vector2(0, 0));
		let BR = this.getTileForRealPosition(new Vector2(Game.viewport.width, Game.viewport.height));

		let minX = TL ? (TL.sprite.position.x / TILESIZE) : 0;
		let minY = TL ? (TL.sprite.position.y / TILESIZE) : 0; 
		let maxX = BR ? (BR.sprite.position.x / TILESIZE) : this.map[0].length;
		let maxY = BR ? (BR.sprite.position.y / TILESIZE) : this.map[0].length;

		for(var y = 0; y < this.map[0].length; y++) {
			for(var x = 0; x < this.map.length; x++) {
				if((x < minX || x > maxX) && (y < minY || y > maxY)) {
					this.map[x][y].sprite.visible = false;
				} else {
					this.map[x][y].sprite.visible = true;
				}
			}
		}
	}

	getTileForMapPosition(vec2) {
		if(!this.map[vec2.x]) {
			return false;
		}

		if(!this.map[vec2.x][vec2.y]) {
			return false;
		}

		return this.map[vec2.x][vec2.y];
	}

	getTileForRealPosition(vec2) {
		var _x = 1 / this.scene.scale.x;
		var _y = 1 / this.scene.scale.y;

		var xx = vec2.x * _x - (_x * this.scene.position.x);
		var yy = vec2.y * _y - (_y * this.scene.position.y);

		var fx = Math.floor(xx / TILESIZE);
		var fy = Math.floor(yy / TILESIZE);

		if(fx < 0 || fy < 0 || fx > this.map.length || fy > this.map[0].length) {
			return false;
		}

		if(!this.map[fx]) {
			return false;
		}

		if(!this.map[fx][fy]) {
			return false;
		}

		return this.map[fx][fy];
	}

	getRealPositionForTile(x, y) {
		var _x = 1 / this.scene.scale.x;
		var _y = 1 / this.scene.scale.y;
		var pos = this.map[x][y].sprite.position;

		if(!pos) {
			return false;
		}

		var xx = pos.x / _x + (_x * this.scene.position.x);
		var yy = pos.y / _y + (_y * this.scene.position.y);

		return new Vector2(xx, yy);
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

	setShadowOffset(vec2) {
		for(var i = 0; i < this.shadows.length; i++) {
			var ref = this.shadows[i];
			ref.position.x = ref.position.x - SHADOWOFFSET.x + vec2.x;
			ref.position.y = ref.position.y - SHADOWOFFSET.y + vec2.y;
		}

		SHADOWOFFSET.x = vec2.x;
		SHADOWOFFSET.y = vec2.y;

		return true;
	}
}