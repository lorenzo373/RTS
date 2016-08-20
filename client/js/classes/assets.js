class Assets {
	constructor() {
		this.ASSET_DIR = "./assets/";
		this.CATEGORY_SPRITE = 0;
		this.CATEGORY_TILE = 1;

		//arrays for all the different categories
		this.tile = [];
		this.sprite = [];

		//load all assets here
		this.addAsset(this.CATEGORY_SPRITE, 'command', 'command.png');

		//get asset with this
		this.getAsset(this.CATEGORY_SPRITE, 'command');
	}

	addAsset(category, identifier, sprite) {
		let categoryArray = [];

		switch(category) {
			case this.CATEGORY_SPRITE:
				categoryArray = this.sprite;
				break;
			case this.CATEGORY_TILE:
				categoryArray = this.tile;
				break;
			default:
				console.log('Assets: invalid category');
				break;
		}

		categoryArray.push({"identifier": identifier, "sprite": PIXI.Texture.fromImage(this.ASSET_DIR + sprite)});
	}

	getAsset(category, identifier) {
		let categoryArray = [];

		switch(category) {
			case this.CATEGORY_SPRITE:
				categoryArray = this.sprite;
				break;
			case this.CATEGORY_TILE:
				categoryArray = this.tile;
				break;
			default:
				console.log('Assets: invalid category');
				return;
		}

		for(var index = 0; index < categoryArray.length; index++) {
			if (categoryArray[index].identifier === identifier) {
				console.log(categoryArray[index].sprite);
				return categoryArray[index].sprite;
			}
		}

		console.log('Assets: asset with identifier "' + identifier + '" requested but not found');
	}
}