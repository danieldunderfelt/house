var $ = require('jquery');

class UI {

	constructor(app) {
		this.app = app;
	}

	initialize() {
		this.startListeners();
	}

	startListeners() {
		$('#newGame').on('click', this.startNewGame.bind(this));
		$(window).on('boardrendered', this.boardRendered.bind(this));
	}

	startNewGame(e) {
		e.preventDefault();
		this.app.newGame();
		$('#newGame').prop('disabled', true);
	}

	boardRendered(e) {
		console.log("board rendered!");
	}
}

module.exports = UI;