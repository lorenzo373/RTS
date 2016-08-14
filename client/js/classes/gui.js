class GUI {
	constructor() {
		// Create FPS counter
		this.fpsCounter = new PIXI.Text('FPS: ', { fontFamily: 'Arial', fontSize: '24px', fill: "#FFFFFF" });
		this.fpsCounter.x = 5;
		this.fpsCounter.y = 5;

		// Add elements to root scene
		Game.rootScene.addChild(this.fpsCounter);

		// Start FPS update interval
		this.startFPSInterval();
	}

	startFPSInterval() {
		this.fpsInterval = setInterval(function() {
			Game.GUI.fpsCounter.text = 'FPS: ' + Game.fps;
			Game.frame = 0;
		}, 1000);
	}
}