var io = require('socket.io-client');

class Server {

	constructor(app) {
		this.app = app;
		this.socket = null;
		this.isConnected = false;
	}

	connect() {
		var self = this;

		if(!this.socket && !this.isConnected) {
			this.socket = io('ws://house.dev:3000/house');

			this.socket.on('connect', function(data) {
				self.initialize();
			});

			this.socket.on('connect_error', function(error) {
				self.isConnected = false;
				self.app.setOffline();
			});
		}
	}

	initialize() {
		this.isConnected = true;
		this.app.setOnline();
	}

	hostGame(player, gameInstance, callback) {
		this.socket.emit('new-game', player);
		this.socket.on('game-joined', callback.bind(gameInstance));
	}

	listenForPlayers(gameInstance, callback) {
		this.socket.on('player-joined', callback.bind(gameInstance));
	}

	startGame(gameId, gameInstance, callback) {
		this.socket.emit('start-game', gameId);
		this.socket.on('turn', callback.bind(gameInstance));
	}
 }

module.exports = Server;