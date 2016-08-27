const RESOURCE_TYPES = {
	TREE: 0,
	STONE: 1,
	FISH: 2
};

class Resource {
	constructor(position, type, amount, sprite, guiSprite) {
		this.position = position;
		this.type = type;
		this.amount = amount;
		this.sprite = sprite;
		this.guiSprite = guiSprite;

		this.sprite.position.x = this.position.x * TILESIZE;
		this.sprite.position.y = this.position.y * TILESIZE;
	}
}