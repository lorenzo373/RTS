class Assets {
	constructor() {
		this.ASSET_DIR = "./assets/";

		//array with all the textures
		this.textures = [];

		//load all assets here
		this.addAsset('command', 'command.png');

		//get asset with this
		this.getAsset('command');
	}

	loadAssetsFolder(callback) {
		var xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function() {
	        if (xhttp.readyState == XMLHttpRequest.DONE) {
	        	var array = xhttp.responseText.split(',');

	        	for (var index = 0; index < array.length; index++) {
	        		//get filename without extension as identifier
	        		var fileNameArray = array[index].split('.');
	        		var fileName = fileNameArray[0];

	        		Game.assets.addAsset(fileName, array[index]);
	        	}

	        	callback();
	        }
    	}

		xhttp.open("GET", "assetloader.php", true);
		xhttp.send();
	}

	addAsset(identifier, sprite) {
		this.textures.push({"identifier": identifier, "sprite": PIXI.Texture.fromImage(this.ASSET_DIR + sprite)});
	}

	getAsset(identifier) {
		for(var index = 0; index < this.textures.length; index++) {
			if (this.textures[index].identifier === identifier) {
				return this.textures[index].sprite;
			}
		}

		console.log('Assets: asset with identifier "' + identifier + '" requested but not found');
	}
}