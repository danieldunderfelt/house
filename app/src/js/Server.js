var io = require('socket.io-client');

class Server {

	constructor(app) {
		this.app = app;
	}

	connect() {
		var socket = io('http://192.168.10.10:3000');
	}
}

module.exports = Server;