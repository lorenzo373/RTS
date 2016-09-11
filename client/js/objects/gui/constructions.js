class Constructions {
    constructor() {
    	var canvas = document.getElementById('constructionslayer');
        if (canvas) {
            document.body.removeChild(canvas);
        }

        var constructionsCanvas = document.createElement('canvas');
        constructionsCanvas.width = 445;
        constructionsCanvas.height = 120;
        constructionsCanvas.id = 'constructionslayer';
        constructionsCanvas.className = 'constructions';

        document.body.appendChild(constructionsCanvas);

        this.render();
    }

    render() {
    	var constructionsCanvas = document.getElementById('constructionslayer');
        var offsetX = 25;

        var ctx = constructionsCanvas.getContext("2d");
        ctx.clearRect(0, 0, constructionsCanvas.width, constructionsCanvas.height);

        //add constructions to building menu
        for (var construction in Game.ConstructionHandler.constructions) {
            var constructionObj = Game.ConstructionHandler.constructions[construction];

            this.renderConstructionItem(constructionObj, constructionsCanvas, offsetX);

            offsetX += 100;
        }
    }

    renderConstructionItem(constructionObj, constructionsCanvas, offsetX) {
        var image = new Image();
            image.src = Game.assets.getAssetURI(constructionObj.sprite);

            image.onload=function(){
                var ctx = constructionsCanvas.getContext("2d");

                ctx.drawImage(image, offsetX, constructionsCanvas.height/2-(image.height/2)-10, image.width, image.height);

                ctx.font = "20px Georgia";
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText("$" + constructionObj.price, offsetX+(TILESIZE/2), constructionsCanvas.height-10);

                //if construction is selected
                if (Game.ConstructionHandler.selectedConstruction.identifier == constructionObj.identifier) {
                    ctx.beginPath();
                    ctx.rect(offsetX-4,12,75,75);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
    }
}