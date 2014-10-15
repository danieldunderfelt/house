var UI = require('./UI');
var Participant = require('./Participant');
var Game = require('./Game');

class App {

	constructor() {
		this.initialPlayer = {};
	}

	start() {
		this.front = new UI(this);
		this.front.initialize();

		if(location.hostname === "localhost") {
			this.initialPlayer = this.createPlayer("Daniel", "green", true);
			this.initializeGame();
		}
	}

	initializeGame() {
		this.front.showGame();
		this.bootGame();
	}

	getInitialPlayer(data) {
		var name = "Awesome player";
		var color = "#FF0000";

		for(var d = 0; d < data.length; d++) {
			var dataElement = data[d];
			if(dataElement.name === "name") name = dataElement.value;
			if(dataElement.name === "color") color = dataElement.value;
		}

		this.initialPlayer = this.createPlayer(name, color, true);
		this.initializeGame();
	}

	createPlayer(name, color, isHost = false) {
		return new Participant(name, color, isHost);
	}

	addPlayerToGame(player) {
		this.game.addPlayer(player);
	}

	bootGame() {
		this.game = new Game(this);
		this.game.initialize(this.initialPlayer);
	}

	newGame() {
		this.game.start();
	}
}

module.exports = new App();