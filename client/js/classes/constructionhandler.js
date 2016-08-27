class ConstructionHandler {
	constructor() {
		this.constructions = [];

		this.loadConstructions();
	}

	loadConstructions() {
		this.loadYAMLFile("constructions.yaml", this.parseConstruction);
	}

	loadYAMLFile(filename, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //convert YAML to a json object
                var output = jsyaml.safeLoad(xhttp.response);
                
                var constructionArray = Object.keys(output).map(function (key) {
                    //little bit of a workaround to add the name of the construction to the array
                    var outputArray = output[key];
                    outputArray["name"] = key;

                    return outputArray;
                });

                for (var index = 0; index < constructionArray.length; index++) {
                    callback(constructionArray[index]);

                    if (index==constructionArray.length-1) {
                        //TODO: if we finished looping through all constructions, initialize the construction menu
                    }
                }
            }
        };
        xhttp.open("GET", filename + "?_=" + new Date().getTime(), true); //add date to bypass caching
        xhttp.send();
    }

	parseConstruction(yaml) {
		//generate menu sprite
        /*var editpic = game.make.sprite(0, 0, yaml.sprite);

        if (yaml.isTileable) {
            editpic.crop(new Phaser.Rectangle(0, 0, tileSize, tileSize));
        }*/

        Game.ConstructionHandler.constructions.push(new Construction(yaml.sprite, yaml.cost));
	}
}