var UI = require('./UI');
var Participant = require('./Participant');
var Game = require('./Game');

class App {

	constructor() {
		this.localPlayer = {};
	}

	start() {
		this.front = new UI(this);
		this.front.initialize();

		if(location.hostname === "localhost") {
			this.localPlayer = new Participant("Daniel", "green", true);
			this.initializeGame();
		}
	}

	initializeGame() {
		this.front.showGame();
		this.bootGame();

		// server.connect()
	}

	getlocalPlayer(data) {
		var name = "Awesome player";
		var color = "#FF0000";

		for(var d = 0; d < data.length; d++) {
			var dataElement = data[d];
			if(dataElement.name === "name") name = dataElement.value;
			if(dataElement.name === "color") color = dataElement.value;
		}

		this.localPlayer = new Participant(name, color, true);
		this.initializeGame();
	}

	bootGame() {
		this.game = new Game(this);
		this.game.initialize(this.localPlayer);
	}
}

module.exports = new App();