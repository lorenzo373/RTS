class Assets {
	constructor() {
		this.ASSET_DIR = "./assets/";

		//array with all the textures
		this.textures = [];
	}

	loadAssetsFolder(callback) {
		var xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function() {
	        if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status==200) {
	        	var array = xhttp.responseText.split(',');

	        	for (var index = 0; index < array.length; index++) {
	        		//get filename without extension as identifier
	        		var fileNameArray = array[index].split('.');
	        		var fileName = fileNameArray[0];

	        		//remove subfolder(s) in identifier and only leave filename
	        		var fileNameArray = fileName.split('\\');
	        		fileName = fileNameArray[fileNameArray.length-1];

	        		Game.assets.addAsset(fileName, array[index]);
	        	}

	        	callback();
	        } else {
	        	console.log("error");
	        	console.log("ready state: " + xhttp.readyState);
	        	console.log("status: " + xhttp.status);
	        }
    	}

		xhttp.open("GET", "./assetloader.php", true);
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

		//console.log('Assets: asset with identifier "' + identifier + '" requested but not found');
	}
}