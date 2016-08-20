var Server = require('./classes/server');
global.SignalHandler = require('./classes/signalhandler');
global.RoomManager = require('./classes/roommanager');

Server.loadConfig();
Server.initServer();
global.RoomManager.init();

process.on('uncaughtException', (e) => {
	console.log('Uncaugth exception -> ', e.stack);
});