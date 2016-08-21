class Assets {
	constructor() {
		this.ASSET_DIR = "./assets/";

		//array with all the textures
		this.textures = [];
	}

	loadAssetsFolder(callback) {
		//if we're on gh-pages, load manually since it doesn't execute PHP
		if (window.location.href == "https://lorenzo373.github.io/RTS/client/") {
			this.addAsset('command', 'buildings/command.png');

			this.addAsset('grass', 'tiles/grass.png');
			this.addAsset('grass2', 'tiles/grass2.png');
			this.addAsset('ocean', 'tiles/ocean.png');
			this.addAsset('rock', 'tiles/rock.png');
			this.addAsset('rock2', 'tiles/rock2.png');
			this.addAsset('sand', 'tiles/sand.png');
			this.addAsset('sand2', 'tiles/sand2.png');
			this.addAsset('snow', 'tiles/snow.png');
			this.addAsset('snow2', 'tiles/snow2.png');
			this.addAsset('taiga', 'tiles/taiga.png');
			this.addAsset('taiga2', 'tiles/taiga2.png');
			this.addAsset('water', 'tiles/water.png');
			this.addAsset('water2', 'tiles/water2.png');

			this.addAsset('palm1', 'palm1.png');
			this.addAsset('palm2', 'palm2.png');
			this.addAsset('palm3', 'palm3.png');
			this.addAsset('tree4', 'tree4.png');
			this.addAsset('tree5', 'tree5.png');
			this.addAsset('tree6', 'tree6.png');

			callback();
		} else {
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
		        }
	    	}

			xhttp.open("GET", "./assetloader.php", true);
			xhttp.send();
		}
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

	randomTint(threshold) {
		threshold = threshold || 20;

		var max = 255 - threshold;
		var rValue = Math.floor(Math.random() * threshold) + max;
		var rgb = rValue | (rValue << 8) | (rValue << 16);
		
        return '0x' + (0x1000000 + rgb).toString(16).slice(1);
	}
}