var Board = require('./Board');

class Game {

	constructor() {
		this.participants = {};
		this.board = {};
	}

	start() {
		this.board = new Board(this);
		this.board.render(10);
	}

	getPlayer() {
		return {
			name: "Daniel",
			color: "green"
		};
	}
}

module.exports = Game;