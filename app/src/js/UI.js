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
		$('#gamesList').on('click', 'li', this.joinGame.bind(this));
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
		this.app.getLocalPlayer(data);
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

	joinGame(e) {
		e.preventDefault();
		var gameId = $(e.currentTarget).data('game');
		this.app.server.joinGame(gameId);
	}

	enableButtons(group) {
		return true;
	}

	doGameLobby(players, game) {
		$('#startGame').on('click', game.start.bind(game));
		this.hideGamesList();
		this.renderPlayersList(players)
	}

	doMainLobby(games) {
		console.log(games);
		$('#newGame').on('click', this.startNewGame.bind(this));
		this.renderGamesList(games);
	}

	hideGamesList() {
		$('.games-list').slideUp();
	}

	renderGamesList(games) {
		$('.games-list').slideDown();
		for(var game in games) {
			this.addToGamesList(games[game]);
		}
	}

	addToGamesList(game) {
		var $template = $('<li data-game="'+ game.id +'"><h4>Host: ' + game.host.name + '</h4></li>');
		$('#gamesList').append($template);
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
		$('#participants').empty();
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