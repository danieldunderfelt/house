var UI = require('./UI');
var Participant = require('./Participant');
var Game = require('./Game');
var Server = require('./Server');

class App {

	constructor() {
		this.localPlayer = {};
		this.server = new Server(this);
		this.isOnline = false;
		this.currentGame = {};
		this.gamesList = {};
	}

	start() {
		this.front = new UI(this);
		this.front.initialize();

		if(location.hostname === "localhost") {
			this.localPlayer = new Participant("Daniel", "green");
			this.initializeGame();
		}
	}

	getLocalPlayer(data) {
		var name = "Awesome player";
		var color = "#FF0000";

		for(var d = 0; d < data.length; d++) {
			var dataElement = data[d];
			if(dataElement.name === "name") name = dataElement.value;
			if(dataElement.name === "color") color = dataElement.value;
		}

		this.localPlayer = new Participant(name, color);
		this.initializeGame();
	}

	initializeGame() {
		this.front.showGame();
		this.server.connect();
	}

	getGamesList(games) {
		this.gamesList = games;
	}

	joinGame(gameId = "new") {
		if(this.isOnline) {
			this.currentGame = new Game(this);
			this.server.registerGame(this.currentGame);
			this.currentGame.initialize();
			this.server.joinGame(gameId);
		}
		else {
			console.log("Not online :(");
		}
	}

	setOnline() {
		this.isOnline = true;
	}

	setOffline() {
		this.isOnline = false;
	}
}

module.exports = new App();