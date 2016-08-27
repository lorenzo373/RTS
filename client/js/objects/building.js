class Building extends Entity {
	constructor(x, y, sprite) {
		super(x, y);

		var texture = Game.assets.getAsset(sprite);
		this.sprite = new PIXI.Sprite(texture);

		this.sprite.position.x = x;
		this.sprite.position.y = y;
		this.sprite.displayGroup = new PIXI.DisplayGroup(3, false);

		Game.sceneHandler.scenes['map'].addChild(this.sprite);
	}
}