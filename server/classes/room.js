class Room {
	constructor() {
		this.id = global.SignalHandler.generateHash();
		this.users = [];
		this.host = null;
		this.seed = Math.random();
	}

	join(socket) {
		if(this.users.length > 1) {
			return false;
		}

		this.users.push(socket);

		return true;
	}

	leave(socket) {
		var user = this.getUser(socket._id);

		if(!user) {
			return false;
		}

		this.removeUser(socket._id);

		if(this.users.length == 0) {
			global.RoomManager.remove(this.id);
		}

		return true;
	}

	getUser(id) {
		for(var i = 0; i < this.users.length; i++) {
			if(this.users[i]._id == id) {
				return this.users[i];
			}
		}

		return false;
	}

	removeUser(id) {
		var user = this.getUser(id);

		if(!user) {
			return false;
		}

		var index = this.users.indexOf(user);
		this.users.splice(index, 1);

		return true;
	}

	kickAllUsers() {
		for(var i = 0; i < this.users.length; i++) {
			this.users[i].emit('leave_room', { success: true, room: this.format() });
			this.removeUser(this.users[i]._id);
		}

		return true;
	}

	format() {
		var formatted = {};
		formatted.id = this.id;
		formatted.users = [];
		formatted.seed = this.seed;
		formatted.host = this.host._id;

		for(var i = 0; i < this.users.length; i++) {
			formatted.users.push(this.users[i]._id);
		}

		return formatted;
	}
}

module.exports = Room;