var GameRoom = require('./GameRoom');
var uuid = require('./helpers').uuid;

class GameManager {

	constructor(socket) {
		this.socket = socket;
		this.connectedClients = {};
		this.games = {};
	}

	initialize() {

	}

	attachClient(client) {
		this.connectedClients[client.id] = {
			client: client,
			game: null,
			player: null
		};

		this.attachListeners(client);
	}

	removeClient(clientId) {
		delete this.connectedClients[clientId];
	}

	attachListeners(client) {
		client.on('new-game', this.startNewGame.bind(this, client));
	}

	startNewGame(client, data) {
		var gameId = uuid();
		var game = new GameRoom(this, gameId);
		this.games[gameId] = game;

		var hostClient = this.connectedClients[client.id];
		hostClient.game = game;
		hostClient.player = data;

		game.initialize(hostClient);
	}

	ping(clientId, eventName, callback = function() {}) {
		this.socket.to(clientId).emit(eventName);
		callback();
	}

	tell(clientId, eventName, data, callback = function() {}) {
		this.socket.to(clientId).emit(eventName, data);
		callback();
	}
}

module.exports = GameManager;