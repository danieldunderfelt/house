var UI = require('./UI');
var Participant = require('./Participant');
var Game = require('./Game');
var Server = require('./Server');

class App {

	constructor() {
		this.localPlayer = {};
		this.server = new Server(this);
		this.isOnline = false;
		this.game
	}

	start() {
		this.front = new UI(this);
		this.front.initialize();

		if(location.hostname === "localhost") {
			this.localPlayer = new Participant("Daniel", "green");
			this.initializeGame();
		}
	}

	initializeGame() {
		this.front.showGame();
		this.server.connect();
	}

	getGamesList(games) {
		this.front.doMainLobby(games);
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

	newGame() {
		if(this.isOnline) {
			this.localPlayer.isHost = true;
			this.game = new Game(this);
			this.server.hostGame(this.localPlayer, this.game, this.game.initialize);
		}
		else {
			console.log("Not online :(");
		}
	}

	joinAsGuest(gameData) {
		if(this.isOnline) {
			this.localPlayer.isHost = false;
			this.game = new Game(this);
			this.game.initialize(gameData);
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