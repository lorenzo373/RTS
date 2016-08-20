class Assets {
	constructor() {
		this.ASSET_DIR = "./assets/";

		//arrays for all the different categories
		this.textures = [];

		//load all assets here
		this.addAsset('command', 'command.png');

		//get asset with this
		this.getAsset('command');
	}

	addAsset(identifier, sprite) {
		this.textures.push({"identifier": identifier, "sprite": PIXI.Texture.fromImage(this.ASSET_DIR + sprite)});
	}

	getAsset(identifier) {
		for(var index = 0; index < this.textures.length; index++) {
			if (this.textures[index].identifier === identifier) {
				console.log(this.textures[index].sprite);
				return this.textures[index].sprite;
			}
		}

		console.log('Assets: asset with identifier "' + identifier + '" requested but not found');
	}
}