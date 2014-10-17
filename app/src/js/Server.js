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

			this.socket.on('connect', function() {
				self.initialize();
			});

			this.socket.on('connect_error', this.disconnect.bind(this));
		}
	}

	initialize() {
		this.isConnected = true;
		this.getGamesList();
		this.app.setOnline();
	}

	registerGame(gameInstance) {
		this.currentGameInstance = gameInstance;
	}

	disconnect() {
		this.isConnected = false;
		this.app.setOffline();
	}

	// App events and actions (always runs)

	getGamesList() {
		this.socket.on('games-list', this.app.getGamesList.bind(this.app));
	}

	// Current game events and actions

	joinGame(gameId) {
		this.socket.emit('join-game', {
			player: this.app.localPlayer,
			game: gameId
		});
	}

	listenForPlayers(callback) {
		this.socket.on('player-joined', callback.bind(this.currentGameInstance));
	}

	startGame(gameId) {
		this.socket.emit('start-game', gameId);
	}

	listenForGameStarted(callback) {
		this.socket.on('game-started', callback.bind(this.currentGameInstance));
	}

	turn(callback) {
		this.socket.on('turn', callback.bind(this.currentGameInstance));
	}

	turnEnd(data) {
		this.socket.emit('turn-end', data);
	}

	wallPlaced(data) {
		this.socket.emit('wall-placed', data);
	}

	score(data) {
		this.socket.emit('player-scored', data);
	}

	sync(callback) {
		this.socket.on('sync-game', callback.bind(this.currentGameInstance));
	}

	syncBoard(callback) {
		this.socket.on('sync-board', callback.bind(this.currentGameInstance));
	}
 }

module.exports = Server;