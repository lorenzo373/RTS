class Networking {
	constructor() {
		this.host = 'http://localhost';
		this.port = '5001';
		this.connection = null;
	}

	connect() {
		this.connection = io(this.host + ':' + this.port);
	}

	disconnect() {
		this.connection._onDisconnect();
	}
}
