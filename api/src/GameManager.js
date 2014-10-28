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

	// Attaches a client to the server on the initial join.
	attachClient(client) {
		this.connectedClients[client.id] = {
			client: client,
			game: null,
			player: null
		};
		this.attachListeners(client);
		this.socket.emit('games-list', this.getGamesList());
	}

	// Prepares a list of games to be served back to the client on server join
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

		return games;
	}

	// When the client disconnects, we need to remove them from the server.
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

	// Attaches initial listeners to the client
	attachListeners(client) {
		client.on('new-game', this.startNewGame.bind(this, client));
		client.on('join-game', this.joinGame.bind(this, client));
		client.on('disconnect', this.removeClient.bind(this, client));
	}

	// Starts a new game on the server. It attaches the host to the game.
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

	// Joins a new client to an exiting game
	joinGame(client, data) {
		var player = {
			client: client.id,
			game: data.game,
			player: data.player
		};

		this.players[data.player.id] = player;
		this.games[data.game].addPlayer(player);
	}

	// Pings the prescribed client with an event, without any data
	ping(clientId, eventName, callback = function() {}) {
		this.socket.to(clientId).emit(eventName);
		callback();
	}

	// Sends some data to a client over some event
	tell(clientId, eventName, data, callback = function() {}) {
		this.socket.to(clientId).emit(eventName, data);
		callback();
	}
}

module.exports = GameManager;