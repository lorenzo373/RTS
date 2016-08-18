class Input {
	constructor() {
		// Define variables
		this.onMouseDownEvents = {};
		this.onMouseUpEvents = {};
		this.onMouseMoveEvents = {};
		this.onMouseWheelEvents = {};
		this.onKeyDownEvents = {};
		this.onKeyUpEvents = {};
		this.keysDown = [];

		// Register events
		document.onmousedown = this.mouseDown;
		document.onmouseup = this.mouseUp;
		document.onmousemove = this.mouseMove;
		document.onwheel = this.mouseWheel;
		document.onkeydown = this.keyDown;
		document.onkeyup = this.keyUp;

		return this;
	}

	mouseDown(e) {
		for(var key in Game.input.onMouseDownEvents) {
			Game.input.onMouseDownEvents[key](e);
		}

		return true;
	}

	mouseUp(e) {
		for(var key in Game.input.onMouseUpEvents) {
			Game.input.onMouseUpEvents[key](e);
		}

		return true;
	}

	mouseMove(e) {
		for(var key in Game.input.onMouseMoveEvents) {
			Game.input.onMouseMoveEvents[key](e);
		}

		return true;
	}

	mouseWheel(e) {
		for(var key in Game.input.onMouseWheelEvents) {
			Game.input.onMouseWheelEvents[key](e);
		}

		return true;
	}

	keyDown(e) {
		for(var key in Game.input.onKeyDownEvents) {
			Game.input.onKeyDownEvents[key](e);
		}

		Game.input.keysDown.push(e.which);

		return true;
	}

	keyUp(e) {
		for(var key in Game.input.onKeyUpEvents) {
			Game.input.onKeyUpEvents[key](e);
		}

		var index = Game.input.keysDown.indexOf(e.which);
		if(index > -1) {
			Game.input.keysDown.splice(index, 1);
		}

		return true;
	}

	onMouseDown(id, func) {
		this.onMouseDownEvents[id] = func;

		return true;
	}

	removeMouseDown(id) {
		delete this.onMouseDownEvents[id];

		return true;
	}

	onMouseUp(id, func) {
		this.onMouseUpEvents[id] = func;

		return true;
	}

	removeMouseUp(id) {
		delete this.onMouseUpEvents[id];

		return true;
	}

	onMouseMove(id, func) {
		this.onMouseMoveEvents[id] = func;

		return true;
	}

	removeMouseMove(id) {
		delete this.onMouseMoveEvents[id];

		return true;
	}

	onMouseWheel(id, func) {
		this.onMouseWheelEvents[id] = func;

		return true;
	}

	removeMouseWheel(id) {
		delete this.onMouseWheelEvents[id];

		return true;
	}

	onKeyDown(id, func) {
		this.onKeyDownEvents[id] = func;

		return true;
	}

	removeKeyDown(id) {
		delete this.onKeyDownEvents[id];

		return true;
	}

	onKeyUp(id, func) {
		this.onKeyUpEvents[id] = func;

		return true;
	}

	removeKeyUp(id) {
		delete this.onKeyUpEvents[id];

		return true;
	}
}
