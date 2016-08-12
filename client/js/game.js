class Game {
	static init() {
		// Create renderer
		Game.renderer = PIXI.autoDetectRenderer(RENDERER_WIDTH, RENDERER_HEIGHT);
		Game.renderer.autoResize = true;
		Game.renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);

		// Add renderer to document
		document.body.appendChild(Game.renderer.view);

		// Create root scene
		Game.rootScene = new PIXI.Container();

		// Bind resize event
		window.onresize = Game.onResize;

		// Init GUI
		Game.GUI = new GUI();

		// Start render loop
		Game.lastLoop = new Date;
		Game.render();
	}

	static render() {
		Game.fps = Math.floor(1000 / (new Date - Game.lastLoop));
		Game.lastLoop = new Date;

		// Request animation frame
		requestAnimationFrame(Game.render);

		// Render root scene
		// TODO: create scene handler & render all different scene dependant on current game state
		Game.renderer.render(Game.rootScene);
	}

	static onResize() {
		// Resize renderer
		Game.renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	}
}