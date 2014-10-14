var UI = require('./UI');
var Game = require('./Game');

class App {

	start() {
		this.front = new UI(this);
		this.front.initialize();
	}

	newGame() {
		this.game = new Game();
		this.game.start();
	}
}

module.exports = new App();