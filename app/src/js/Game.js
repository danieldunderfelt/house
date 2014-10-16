var Board = require('./Board');

class Game {

	constructor(app) {
		this.app = app;
		this.currentGameId = null;
		this.board = {};
		this.players = {};
		this.initialized = false;
	}

	initialize(gameData) {
		if(!this.initialized) {
			this.initialized = true;
			this.players = gameData.players;
			this.currentGameId = gameData.id;
			this.app.front.doGameLobby(this.players, this);
		}
		else {
			this.addPlayer(gameData);
		}
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
		console.log()
	}

	startTurn() {
		this.board.active = true;
	}

	endTurn() {
		this.board.active = false;
	}
}

module.exports = Game;