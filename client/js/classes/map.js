class Map {
	constructor(width, height) {
		let tiles = ['grass.png', 'grass2.png', 'rock.png', 'water.png'];

		// Create map scene
		this.scene = Game.sceneHandler.createScene('map', true, 0);

		this.map = [];
		for(var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) {
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
}