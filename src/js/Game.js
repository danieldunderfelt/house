var Board = require('./Board');

class Game {

	constructor(app) {
		this.app = app;
		this.board = {};
		this.players = {};
		this.localPlayer = {};
		this.isStarted = false;
		this.currentPlayerTurn = null;
	}

	initialize(initialPlayer) {
		this.localPlayer = initialPlayer;
		this.addPlayer(this.localPlayer);
		this.app.front.renderPlayersList(this.players);
	}

	addPlayer(player) {
		this.players[player.name] = player;
	}

	start() {
		if(!this.isStarted) {
			this.isStarted = true;
			this.board = new Board(this);
			this.board.render(10);

			this.turnLoop();
		}
	}

	getPlayer() {
		return this.localPlayer;
	}

	playerScored() {

	}
}

module.exports = Game;