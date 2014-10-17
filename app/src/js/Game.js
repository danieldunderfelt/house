var Board = require('./Board');

class Game {

	constructor(app) {
		this.app = app;
		this.currentGameId = null;
		this.board = {};
		this.players = {};
		this.currentActivePlayer = "";
		this.localPlayer = "";
		this.ready = false;
		this.isStarted = false;
	}

	initialize() {
		this.localPlayer = this.app.localPlayer.id;
		this.app.server.listenForPlayers(this.addPlayer);
		this.app.server.sync(this.syncGame);
	}

	// Event: 'player-joined'
	addPlayer(playerData) {
		this.players[playerData.id] = playerData;
	}

	// Event: 'sync-game'
	syncGame(gameData) {
		this.players = gameData.players;

		if(!this.ready) {
			this.currentGameId = gameData.id;
			this.app.server.listenForGameStarted(this.startGame);
			this.ready = true;
		}
	}

	// Event: 'sync-board'
	syncStatus(gameData) {

	}

	// Event: 'turn'
	syncTurn(turnData) {
		this.currentActivePlayer = turnData.playerId;
		if(turnData.playerId === this.localPlayer) {
			this.myTurn();
		}
	}

	myTurn() {
		this.startTurn();
	}

	startTurn() {
		this.board.active = true;
	}

	endTurn() {
		this.board.active = false;
		this.app.server.turnEnd();
	}

	initializeStart() {
		this.app.server.startGame(this.id);
	}

	startGame() {
		if(!this.isStarted) {
			this.isStarted = true;
			this.board = new Board(this);
			this.board.render(10);
			this.startGameListeners();
		}
	}

	startGameListeners() {
		this.app.server.turn(this.syncTurn);
		this.app.server.syncBoard(this.syncStatus);
	}
}

module.exports = Game;