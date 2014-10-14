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
}

module.exports = Game;