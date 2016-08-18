class SceneHandler {
	constructor() {
		this.scenes = {};
	}

	createScene(name, visible) {
		visible = visible || false;
		var scene = new PIXI.Container();

		this.scenes[name] = {
			scene: scene,
			visible: visible
		};

		return scene;
	}

	showScene(name) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}

		this.scenes[name].visible = true;

		return true;
	}

	hideScene(name) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}

		this.scenes[name].visible = false;

		return true;
	}

	render() {
		for(var key in this.scenes) {
			if(this.scenes[key].visible) {
				Game.renderer.render(this.scenes[key].scene);
			}
		}
	}
}