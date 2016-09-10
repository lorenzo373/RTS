class GUI {
    constructor() {
        // Create GUI scene
        this.scene = Game.sceneHandler.createScene('GUI', true, 10);

        // Create Debug info
        this.debugContainer = new PIXI.Container();
        this.debugContainer.visible = false;

        this.fpsCounter = new PIXI.Text('FPS: ', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: "#FFFFFF"
        });
        this.fpsCounter.x = 5;
        this.fpsCounter.y = 5;
        this.fpsCounter.visible = true;
        this.debugContainer.addChild(this.fpsCounter);

        this.activeScenes = new PIXI.Text('ACTIVE SCENES: ', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: "#FFFFFF"
        });
        this.activeScenes.x = 5;
        this.activeScenes.y = 34;
        this.activeScenes.visible = true;
        this.debugContainer.addChild(this.activeScenes);

        this.mapNoise = new PIXI.Text('MAP NOISE X: \nMAP NOISE Y: \nMAP GEN: ', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: "#FFFFFF"
        });
        this.mapNoise.x = 5;
        this.mapNoise.y = 63;
        this.mapNoise.visible = true;
        this.debugContainer.addChild(this.mapNoise);

        this.scene.addChild(this.debugContainer);

        // Start FPS update interval
        this.startFPSInterval();

        // Init key binds
        this.initEvents();
    }

    startFPSInterval() {
        this.fpsInterval = setInterval(() => {
            Game.GUI.fpsCounter.text = 'FPS: ' + Game.fps;
            Game.frame = 0;
        }, 1000);
    }

    initEvents() {
        Game.registerUpdate('GUI', frame => {
            Game.GUI.activeScenes.text = 'ACTIVE SCENES: ' + Object.keys(Game.sceneHandler.scenes).length;
            Game.GUI.mapNoise.text = 'MAP NOISE X: ' + Game.map.noise.x + '\nMAP NOISE Y: ' + Game.map.noise.y + '\nMAP GEN: ' + Game.map.generator;
        });

        Game.input.onKeyDown('GUI', e => {
            switch (e.which) {
                // 1
                case 49:
                    Game.GUI.debugContainer.visible = !Game.GUI.debugContainer.visible;
                    break;
                    // 2
                case 50:
                    Game.map.load();
                    break;
                    // 3
                case 51:
                    Game.map.generator = (Game.map.generator == 'PERLIN') ? 'SIMPLEX' : 'PERLIN';
                    break;
            }
        });
    }

    loadConstructions() {
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

        this.renderConstructions();
    }

    renderConstructions() {
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
                ctx.fillText(constructionObj.price, offsetX+(TILESIZE/2), constructionsCanvas.height-10);

                //if construction is selected
                if (Game.ConstructionHandler.selectedConstruction.identifier == constructionObj.identifier) {
                    ctx.beginPath();
                    ctx.rect(offsetX-4,12,75,75);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
    }

    loadMinimap() {
        var canvas = document.getElementById('minimap');
        if (canvas) {
            document.body.removeChild(canvas);
        }

        var canvasLayer = document.getElementById('minimaplayer');
        if (canvasLayer) {
            document.body.removeChild(canvasLayer);
        }

        var minimapCanvas = document.createElement('canvas');
        minimapCanvas.width = Game.map.map.length;
        minimapCanvas.height = Game.map.map[0].length;
        minimapCanvas.id = 'minimap';
        minimapCanvas.className = 'minimap';

        var minimapCanvasLayer = document.createElement('canvas');
        minimapCanvasLayer.width = Game.map.map.length;
        minimapCanvasLayer.height = Game.map.map[0].length;
        minimapCanvasLayer.id = 'minimaplayer';
        minimapCanvasLayer.className = 'minimap';

        this.minimap = minimapCanvas;
        this.minimapLayer = minimapCanvasLayer;
        document.body.appendChild(this.minimap);
        document.body.appendChild(this.minimapLayer);
    }

    renderMinimap() {
        var canvas = document.getElementById('minimap');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, Game.map.map.length, Game.map.map[0].length);

        for (var y = 0; y < Game.map.map[0].length; y++) {
            for (var x = 0; x < Game.map.map.length; x++) {
                var tile = Game.map.getTileForMapPosition(new Vector2(x, y));
                ctx.fillStyle = tile.type.color;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        this.renderViewport();
    }

    renderViewport() {
        let sq = Game.map.lastViewport;

        let minX = sq.TL ? (sq.TL.sprite.position.x / TILESIZE) : (sq.BL ? (sq.BL.sprite.position.x / TILESIZE) : 0);
        let minY = sq.TL ? (sq.TL.sprite.position.y / TILESIZE) : (sq.TR ? (sq.TR.sprite.position.y / TILESIZE) : 0);
        let maxX = sq.BR ? (sq.BR.sprite.position.x / TILESIZE) : (sq.TR ? (sq.TR.sprite.position.x / TILESIZE) : Game.map.map.length);
        let maxY = sq.BR ? (sq.BR.sprite.position.y / TILESIZE) : (sq.BL ? (sq.BL.sprite.position.y / TILESIZE) : Game.map.map[0].length);

        var canvas = document.getElementById('minimaplayer');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, Game.map.map.length, Game.map.map[0].length);

        ctx.beginPath();
        ctx.strokeStyle = 'rgb(50, 50, 50)';
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
        ctx.stroke();
        ctx.closePath();
    }
}