var uuid = require('./helpers').uuid;

class Participant {

	constructor(name, color) {
		this.id = uuid();
		this.name = name;
		this.color = color;
		this.score = 0;
		this.cellsClaimed = [];
		this.winner = false;
		this.isHost = false;
	}

	getInfo() {
		return {
			id: this.id,
			name: this.name,
			color: this.color,
			points: this.points,
			isHost: this.isHost
		};
	}
}

module.exports = Participant;