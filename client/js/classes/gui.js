class GUI {
	constructor() {
		// Create GUI scene
		this.scene = Game.sceneHandler.createScene('GUI', true, 10);

		// Create Debug info
		this.fpsCounter = new PIXI.Text('FPS: ', { fontFamily: 'Arial', fontSize: '24px', fill: "#FFFFFF" });
		this.fpsCounter.x = 5;
		this.fpsCounter.y = 5;
		this.fpsCounter.visible = false;
		this.scene.addChild(this.fpsCounter);

		this.activeScenes = new PIXI.Text('ACTIVE SCENES: ', { fontFamily: 'Arial', fontSize: '24px', fill: "#FFFFFF" });
		this.activeScenes.x = 5;
		this.activeScenes.y = 34;
		this.activeScenes.visible = false;
		this.scene.addChild(this.activeScenes);

		// TEST -> Works...
		/*var texture = PIXI.Texture.fromImage('./assets/grass.png');
		var sprite = new PIXI.Sprite(texture);
		sprite.position.x = 50;
		sprite.position.y = 50;
		this.scene.addChild(sprite);*/

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
		});

		Game.input.onKeyDown('GUI', e => {
			switch(e.which) {
				// 1
				case 49:
					Game.GUI.fpsCounter.visible = !Game.GUI.fpsCounter.visible;
					Game.GUI.activeScenes.visible = !Game.GUI.activeScenes.visible;
					break;
			}
		});
	}
}