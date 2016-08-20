class Tile {
	constructor(type) {
		this.type = type;

		var texture = Game.assets.getAsset(type.assets[Math.floor(Math.random() * type.assets.length)]);
		this.sprite = new PIXI.Sprite(texture);
	}
}