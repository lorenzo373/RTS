class Tile {
	constructor(type) {
		this.type = type;

		var texture = PIXI.Texture.fromImage(ASSET_DIR + type.assets[Math.floor(Math.random() * type.assets.length)]);
		this.sprite = new PIXI.Sprite(texture);
	}
}