class SceneHandler {
	constructor() {
		this.rootScene = new PIXI.Container();
		this.rootScene.displayList = new PIXI.DisplayList();
		this.scenes = {};
	}

	createScene(name, visible, index) {
		index = index || 0;
		var scene = new PIXI.Container();

		this.scenes[name] = scene;
		this.setIndex(name, index);
		this.rootScene.addChild(this.scenes[name]);

		return scene;
	}

	destroyScene(name) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}
		
		var scene = this.scenes[name];
		this.rootScene.removeChild(scene);
		scene.destroy();

		return true;
	}

	showScene(name) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}

		this.scenes[name].scene.visible = true;

		return true;
	}

	hideScene(name) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}

		this.scenes[name].visible = false;

		return true;
	}

	setIndex(name, index) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}

		this.scenes[name].displayGroup = new PIXI.DisplayGroup(index, false);

		return true;
	}

	render() {
		Game.renderer.render(this.rootScene);

		return true;
	}
}