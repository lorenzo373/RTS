class SceneHandler {
	constructor() {
		this.scenes = {};
	}

	createScene(name, visible, index) {
		visible = visible || false;
		index = index || 0;
		var scene = new PIXI.Container();

		this.scenes[name] = {
			scene: scene,
			visible: visible,
			index: index
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

	setIndex(name, index) {
		if(!this.scenes.hasOwnProperty(name)) {
			return false;
		}

		this.scenes[name].index = index;

		return true;
	}

	render() {
		var scenes = [];

		for(var key in this.scenes) {
			scenes.push([this.scenes[key].index, this.scenes[key].scene, this.scenes[key].visible]);
		}

		scenes.sort((a, b) => {
			a[0] - b[0]
		});

		for(var i = 0; i < scenes.length; i++) {
			if(scenes[i][2]) {
				Game.renderer.render(scenes[i][1]);
			}
		}

		return true;
	}
}