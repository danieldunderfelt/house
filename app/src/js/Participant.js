class Participant {

	constructor(name, color, isHost) {
		this.name = name;
		this.color = color;
		this.score = 0;
		this.cellsClaimed = [];
		this.winner = false;
		this.isHost = isHost;
	}

	getInfo() {
		return {
			name: this.name,
			color: this.color,
			points: this.points,
			isHost: this.isHost
		};
	}
}

module.exports = Participant;