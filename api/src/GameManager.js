var GameRoom = require('./GameRoom');
var uuid = require('./helpers').uuid;

class GameManager {

	constructor(socket) {
		this.socket = socket;
		this.connectedClients = {};
		this.players = {};
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
		this.socket.emit('games-list', this.getGamesList());
	}

	getGamesList() {
		var games = {};

		for(var game in this.games) {
			if(!this.games[game].isStarted) {
				games["id"] = {
					id: this.games[game].id,
					host: this.games[game].host
				};
			}
		}

		console.log(games);

		return games;
	}

	removeClient(client) {
		console.log(client.id + " disconnected :(");

		if(
			Object.keys(this.players).length !== 0 &&
			typeof this.connectedClients[client.id] !== "undefined" &&
			this.connectedClients[client.id].player !== null
		) {
			delete this.players[this.connectedClients[client.id].player.id];
		}

		if(typeof this.connectedClients[client.id] !== "undefined")
			delete this.connectedClients[client.id];
	}

	attachListeners(client) {
		client.on('new-game', this.startNewGame.bind(this, client));
		client.on('join-game', this.joinGame.bind(this, client));
		client.on('disconnect', this.removeClient.bind(this, client));
	}

	startNewGame(client, data) {
		var gameId = uuid();
		var game = new GameRoom(this, gameId);
		this.games[gameId] = game;

		var hostClient = this.connectedClients[client.id];
		hostClient.game = gameId;
		hostClient.player = data.id;

		var player = {
			client: client.id,
			game: gameId,
			player: data
		};

		this.players[data.id] = player;

		game.initialize(player);
	}

	joinGame(client, data) {
		var player = {
			client: client.id,
			game: data.game,
			player: data.player
		};

		this.players[data.player.id] = player;
		this.games[data.game].addPlayer(player);
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