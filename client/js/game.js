class Game {
	static init() {
		// Create renderer
		Game.renderer = PIXI.autoDetectRenderer(RENDERER_WIDTH, RENDERER_HEIGHT, { transparent: true });
		Game.renderer.autoResize = true;
		Game.renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);

		// Set viewport
		Game.viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };

		// Add renderer to document
		document.body.appendChild(Game.renderer.view);

		// Create input handler
		Game.input = new Input();

		// Load assets
		Game.assets = new Assets();

		Game.assets.loadAssetsFolder(function() {
			// Create root scene
			Game.sceneHandler = new SceneHandler();

			// Bind events & create handlers
			window.onresize = Game.onResize;
			Game.updateEvents = {};

			// Init player
			Game.player = new Player();

			// Init GUI
			Game.GUI = new GUI();

			// Create map
			Game.map = new Map(MAP_WIDTH, MAP_HEIGHT);
			Game.GUI.loadMinimap();

			// Start render loop
			Game.frame = 0;
			Game.lastLoop = new Date;
			Game.render();
		});
	}

	static render() {
		Game.frame++;
		Game.fps = Math.floor(1000 / (new Date - Game.lastLoop));
		Game.lastLoop = new Date;

		// Update
		Game.update();

		// Request animation frame
		requestAnimationFrame(Game.render);

		// Render scenes
		Game.sceneHandler.render();
	}

	static onResize() {
		// Resize renderer
		Game.renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);

		// Set viewport
		Game.viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };

		// Cul
		Game.map.cul();
	}

	static update() {
		for(var key in Game.updateEvents) {
			Game.updateEvents[key](Game.frame);
		}
	}

	static registerUpdate(id, func) {
		Game.updateEvents[id] = func;

		return true;
	}

	static removeUpdate(id) {
		delete Game.updateEvents[id];

		return true;
	}
}