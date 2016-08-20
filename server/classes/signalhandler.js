class SignalHandler {
	static bindEvents(socket) {
		let events = ['sign_in', 'create_room', 'get_rooms', 'get_room', 'join_room', 'leave_room'];

		for(var i = 0; i < events.length; i++) {
			socket.on(events[i], SignalHandler[events[i]]);
		}

		return true;
	}

	static sign_in(data) {
		this._id = SignalHandler.generateHash();
		this.emit('sign_in', { success: true, id: this._id });
		console.log('user with id ' + this._id + ' signed in');
	}

	static create_room(data) {
		var room = global.RoomManager.create(this);

		if(!room) {
			this.emit('create_room', { success: false });
			return;
		}

		this.emit('create_room', { success: true, room: room.format() });
	}

	static get_rooms(data) {
		var formatted = [];

		for(var key in global.RoomManager.rooms) {
			formatted.push(global.RoomManager.rooms[key].format());
		}

		this.emit('get_rooms', { success: true, rooms: formatted });
	}

	static get_room(data) {
		data = JSON.parse(data);
		if(!data.hasOwnProperty('id')) {
			this.emit('get_room', { success: false });
			return;
		}

		var room = global.RoomManager.get(data.id);

		if(!room) {
			this.emit('get_room', { success: false });
			return;
		}

		this.emit('get_room', { success: true, room: room.format() });
	}

	static join_room(data) {
		data = JSON.parse(data);
		if(!data.hasOwnProperty('id')) {
			this.emit('join_room', { success: false });
			return;
		}

		var room = global.RoomManager.get(data.id);

		if(!room) {
			this.emit('join_room', { success: false });
			return;
		}

		var exists = global.RoomManager.getWithUser(this._id);

		if(exists) {
			this.emit('join_room', { success: false, reason: 'already in room' });
			return;
		}

		if(!room.join(this)) {
			this.emit('join_room', { success: false, reason: 'full' });
			return;
		}

		this.emit('join_room', { success: true, room: room.format() });
	}

	static leave_room(data) {
		data = JSON.parse(data);
		if(!data.hasOwnProperty('id')) {
			this.emit('leave_room', { success: false, message: 'Missing property id' });
			return;
		}

		var room = global.RoomManager.get(data.id);

		if(!room) {
			this.emit('leave_room', { success: false });
			return;
		}

		room.leave(this);

		this.emit('leave_room', { success: true });
	}

	static generateHash(length) {
		length = length || 10;

		var text = '';
	    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	    for(var i = 0; i < length; i++) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

	    return text;
	}
}

module.exports = SignalHandler;