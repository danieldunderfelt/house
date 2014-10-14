function throttle(e,t,n){t||(t=250);var r,i;return function(){var s=n||this;var o=+(new Date),u=arguments;if(r&&o<r+t){clearTimeout(i);i=setTimeout(function(){r=o;e.apply(s,u)},t)}else{r=o;e.apply(s,u)}}}

class Borders {

	constructor(board, grid) {
		this.board = board;
		this.grid = grid;

		this.canvas = document.getElementById('borders');
		this.ctx = this.canvas.getContext('2d');

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.linesClaimed = [];

		this.indicatorData = null;
		this.refinedCoords = null;
		this.doRender = false;
	}

	renderInitial() {
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.lineTo(this.width, 0);
		this.ctx.lineTo(this.width, this.height);
		this.ctx.lineTo(0, this.height);
		this.ctx.lineTo(0, 0);
		this.ctx.lineWidth = 4;
		this.ctx.strokeStyle = '#444444';
		this.ctx.stroke();

		this.startListeners();
	}

	startListeners() {
		this.canvas.addEventListener('mousemove', throttle(this.indicateLine, 30, this));
		this.canvas.addEventListener('mouseover', this.startIndicatorRender.bind(this));
		this.canvas.addEventListener('mouseout', this.stopIndicatorRender.bind(this));
	}

	indicateLine(e) {
		var coords = this.getLinePosition(e.offsetX, e.offsetY, e.movementX, e.movementY);
		if(this.coordsChanged(coords)) {
			this.setIndicatorData(coords);
		}
	}

	getLinePosition(x, y, moveX, moveY) {
		var trackX = Math.floor((x * 1.6) / 100) + 1;
		var trackY = Math.floor((y * 1.6) / 100) + 1;
		var side = "";

		if(moveX < 0 && moveX < moveY) side = "left";
		else if(moveX > 0 && moveX > moveY) side = "right";
		else if(moveX < moveY && moveY < 0) side = "up";
		else if(moveX < moveY && moveY > 0) side = "down";

		return {
			x: trackX,
			y: trackY,
			side: side
		};
	}

	coordsChanged(coords) {
		if(this.indicatorData !== null) {
			var passes = false;

			if(coords.x > this.indicatorData.x || coords.x < this.indicatorData.x) {
				passes = true;
			}
			if(coords.y > this.indicatorData.y || coords.y < this.indicatorData.y) {
				passes = true;
			}

			return passes;
		}

		return true;
	}

	setIndicatorData(coords) {
		this.indicatorData = coords;
	}

	startIndicatorRender() {
		this.doRender = true;
		this.renderIndicator();
	}

	stopIndicatorRender() {
		this.doRender = false;
	}

	renderIndicator() {
		var self = this;
		if(this.doRender) {
			requestAnimationFrame(this.drawIndicator.bind(this));
		}
	}

	drawIndicator() {
		this.clear();
		this.drawClaimed();
		this.drawLine(this.indicatorData);
		this.renderIndicator();
	}

	drawClaimed() {
		for(var c = 0; c < this.linesClaimed.length; c++) {
			this.drawLine(this.linesClaimed[c]);
		}
	}

	drawLine(coords) {
		this.refinedCoords = this.decipherCoords(coords);
		this.ctx.beginPath();
		this.ctx.moveTo.apply(this.ctx, this.refinedCoords.from);
		this.ctx.lineTo.apply(this.ctx, this.refinedCoords.to);
		this.ctx.lineWidth = 4;
		this.ctx.strokeStyle = '#444444';
		this.ctx.stroke();
	}

	decipherCoords(coords) {
		var track = coords.side === "left" || coords.side === "right" ? "x" : "y";
		var x = coords.x;
		var y = coords.y;
		var coord = {};

		if(track === "y") {
			x = x > 9 ? 9 : x;

			coord = {
				from: [x * 60, (y - 1) * 60],
				to: [x * 60, y * 60]
			}
		}
		if(track === "x") {
			y = y > 9 ? 9 : y;

			coord = {
				from: [(x - 1) * 60, y * 60],
				to: [x * 60, y * 60]
			}
		}

		return coord;
	}

	clear() {
		this.ctx.clearRect(2, 2, this.canvas.width - 4, this.canvas.height - 4);
	}
}

module.exports = Borders;