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
		});

		Game.input.onKeyDown('GUI', e => {
			switch(e.which) {
				// 1
				case 49:
					Game.GUI.debugContainer.visible = !Game.GUI.debugContainer.visible;
					break;
			}
		});
	}
}