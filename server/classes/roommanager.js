class RoomManager {
	static init() {
		RoomManager.rooms = {};
	}

	static create(host) {
		var exists = RoomManager.getWithUser(host._id);

		if(exists) {
			return false;
		}

		var Room = require('./room');
		var room = new Room();
		room.host = host;
		room.join(host);
		RoomManager.rooms[room.id] = room;

		return room;
	}

	static get(id) {
		if(!RoomManager.rooms.hasOwnProperty(id)) {
			return false;
		}

		return RoomManager.rooms[id];
	}

	static remove(id) {
		var room = RoomManager.get(id);

		if(!room) {
			return false;
		}

		room.kickAllUsers();
		delete RoomManager.rooms[id];

		return true;
	}

	static getWithUser(id) {
		for(var key in RoomManager.rooms) {
			var user = RoomManager.rooms[key].getUser(id);

			if(user) {
				return RoomManager.rooms[key];
			}
		}

		return false;
	}
}

module.exports = RoomManager;