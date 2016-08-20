class Server {
	static loadConfig() {
		let fs = require('fs');
		var data = fs.readFileSync('./config.json', { encoding: 'utf-8' });

		try {
			var json = JSON.parse(data);

			Server.config = {};
			for(var key in json) {
				Server.config[key] = json[key];
			}

			return true;
		}

		catch(e) {
			console.log(e);
			return false;
		}
	}

	static initServer() {
		var server = require('http').createServer();
		var io = require('socket.io')(server);

		io.on('connection', function(socket) {
			console.log('connection');

			socket.on('disconnect', function() { console.log('disconnection'); });
			global.SignalHandler.bindEvents(socket);
		});

		server.listen(Server.config.port, function() {
			console.log(new Date(), ':: Server listening on port', Server.config.port);
		});

		return true;
	}
}

module.exports = Server;