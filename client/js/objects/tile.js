class Tile {
	constructor(type) {
		this.type = type;

		var texture = Game.assets.getAsset(type.asset);
		this.sprite = new PIXI.Sprite(texture);
		this.sprite.tint = Game.assets.randomTint();
	}
}