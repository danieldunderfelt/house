var $ = require('jquery');
var Velocity = require('velocity-animate');

class UI {

	constructor(app) {
		this.app = app;
	}

	initialize() {
		this.startListeners();
	}

	startListeners() {
		$('input[name="color"]').on('keyup', this.showColor.bind(this));
		$('#startForm').on('submit', this.handlePlayerForm.bind(this));
		$('#newGame').on('click', this.startNewGame.bind(this));
		$(window).on('boardrendered', this.boardRendered.bind(this));
	}

	showColor(e) {
		var colorPreview = $('#colorPreview');
		var colorInput = $(e.currentTarget).val();
		colorPreview.css('background', colorInput);
	}

	handlePlayerForm(e) {
		e.preventDefault();
		var data = $(e.currentTarget).serializeArray();
		this.app.getInitialPlayer(data);
	}

	showGame() {
		var $startScreen = $('.start-screen');
		var $mainGame = $('.main-game');

		Velocity($startScreen[0], 'slideUp', {
			duration: 500,
			complete: function() {
				Velocity($mainGame[0], 'slideDown', 500);
			}
		});
	}

	startNewGame(e) {
		e.preventDefault();
		this.app.newGame();
		$('#newGame').prop('disabled', true);
	}

	boardRendered(e) {
		console.log("board rendered!");
	}

	renderPlayersList(players) {
		for(var player in players) {
			this.addToPlayerList(players[player]);
		}
	}

	addToPlayerList(player) {
		var $template = $('<li data-player="'+ player.name +'"><h4>' + player.name + '</h4><span class="score">' + player.score + '</span></li>');

		if(player.isHost) {
			$template.prepend('<span class="host">Host</span>');
		}

		$template.css('background-color', player.color);

		$('#participants').append($template);
	}

	setPlayerScore(player) {
		var $playerList = $('#participants');
	}
}

module.exports = UI;