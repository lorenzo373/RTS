class GUI {
	constructor() {
		// Create GUI scene
		this.scene = Game.sceneHandler.createScene('GUI', true, 10);

		// Create Debug info
		this.debugContainer = new PIXI.Container();
		this.debugContainer.visible = false;

		this.fpsCounter = new PIXI.Text('FPS: ', { fontFamily: 'Arial', fontSize: '24px', fill: "#FFFFFF" });
		this.fpsCounter.x = 5;
		this.fpsCounter.y = 5;
		this.fpsCounter.visible = true;
		this.debugContainer.addChild(this.fpsCounter);

		this.activeScenes = new PIXI.Text('ACTIVE SCENES: ', { fontFamily: 'Arial', fontSize: '24px', fill: "#FFFFFF" });
		this.activeScenes.x = 5;
		this.activeScenes.y = 34;
		this.activeScenes.visible = true;
		this.debugContainer.addChild(this.activeScenes);

		this.mapNoise = new PIXI.Text('MAP NOISE X: \nMAP NOISE Y: \nMAP GEN: ', { fontFamily: 'Arial', fontSize: '24px', fill: "#FFFFFF" });
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
			switch(e.which) {
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

	loadMinimap() {
		var canvas = document.getElementById('minimap');
		if(canvas) {
			document.body.removeChild(canvas);
		}

		var canvasLayer = document.getElementById('minimaplayer');
		if(canvasLayer) {
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

		for(var y = 0; y < Game.map.map[0].length; y++) {
			for(var x = 0; x < Game.map.map.length; x++) {
				var tile = Game.map.getTileForMapPosition(new Vector2(x, y));
				ctx.fillStyle = tile.type.color;
				ctx.fillRect(x, y, 1, 1);
			}
		}

		this.renderViewport();
	}

	renderViewport() {
		let TL = Game.map.getTileForRealPosition(new Vector2(0, 0));
		let TR = Game.map.getTileForRealPosition(new Vector2(Game.viewport.width, 0));
		let BL = Game.map.getTileForRealPosition(new Vector2(0, Game.viewport.height));
		let BR = Game.map.getTileForRealPosition(new Vector2(Game.viewport.width, Game.viewport.height));

		let minX = TL ? (TL.sprite.position.x / TILESIZE) : (BL ? (BL.sprite.position.x / TILESIZE) : 0);
		let minY = TL ? (TL.sprite.position.y / TILESIZE) : (TR ? (TR.sprite.position.y / TILESIZE) : 0); 
		let maxX = BR ? (BR.sprite.position.x / TILESIZE) : (TR ? (TR.sprite.position.x / TILESIZE) : Game.map.map.length);
		let maxY = BR ? (BR.sprite.position.y / TILESIZE) : (BL ? (BL.sprite.position.y / TILESIZE) : Game.map.map[0].length);

		var canvas = document.getElementById('minimaplayer');
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, Game.map.map.length, Game.map.map[0].length);

		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.rect(minX, minY, maxX - minX, maxY - minY);
		ctx.stroke();
		ctx.closePath();
	}
}