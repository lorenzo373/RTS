class Input() {
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
		for(var key in this.onMouseDownEvents) {
			this.onMouseDownEvents[key](e);
		}

		return true;
	}

	mouseUp(e) {
		for(var key in this.onMouseUpEvents) {
			this.onMouseUpEvents[key](e);
		}

		return true;
	}

	mouseMove(e) {
		for(var key in this.onMouseMoveEvents) {
			this.onMouseMoveEvents[key](e);
		}

		return true;
	}

	mouseWheel(e) {
		for(var key in this.onMouseWheelEvents) {
			this.onMouseWheelEvents[key](e);
		}

		return true;
	}

	keyDown(e) {
		for(var key in this.onKeyDownEvents) {
			this.onKeyDownEvents[key](e);
		}

		this.keysDown.push(e.which);

		return true;
	}

	keyUp(e) {
		for(var key in this.onKeyUpEvents) {
			this.onKeyUpEvents[key](e);
		}

		var index = this.keysDown.indexOf(e.which);
		if(index > -1) {
			this.keysDown.splice(index, 1);
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
