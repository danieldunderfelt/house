var Board = require('./Board');

class Game {

	constructor(app) {
		this.app = app;
		this.board = {};
		this.players = {};
		this.clientPlayer = {};

		this.isStarted = false;
	}

	initialize(initialPlayer) {
		this.clientPlayer = initialPlayer;
		this.addPlayer(this.clientPlayer);

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
		}
	}

	getPlayer() {
		return this.clientPlayer;
	}
}

module.exports = Game;