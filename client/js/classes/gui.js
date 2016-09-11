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