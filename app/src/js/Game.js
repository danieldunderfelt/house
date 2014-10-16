var Board = require('./Board');

class Game {

	constructor(app) {
		this.app = app;
		this.currentGameId = null;
		this.board = {};
		this.players = {};
		this.host = "";
		this.initialized = false;
	}

	initialize(gameData) {
		this.initialized = true;
		this.players = gameData.players;

		for(var player in gameData.players) {
			if(gameData.players[player].isHost) {
				this.host = gameData.players[player].id;
				break;
			}
		}

		this.currentGameId = gameData.id;
		this.app.front.doGameLobby(this.players, this);
		this.app.server.listenForPlayers(this, this.addPlayer);
	}

	addPlayer(playerData) {
		this.players[playerData.id] = playerData;
		this.app.front.renderPlayersList(this.players);
	}

	start() {
		this.isStarted = true;
		this.board = new Board(this);
		this.board.render(10);

		this.app.server.startGame(this.id, this, this.turn);
	}

	playerScored() {
		var scorer = this.app.localPlayer;
		return scorer;
	}

	turn(playerId) {
		console.log(playerId);
	}

	startTurn() {
		this.board.active = true;
	}

	endTurn() {
		this.board.active = false;
	}
}

module.exports = Game;