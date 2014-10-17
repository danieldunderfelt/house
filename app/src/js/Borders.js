function throttle(e,t,n){t||(t=250);var r,i;return function(){var s=n||this;var o=+(new Date),u=arguments;if(r&&o<r+t){clearTimeout(i);i=setTimeout(function(){r=o;e.apply(s,u)},t)}else{r=o;e.apply(s,u)}}}

class Borders {

	constructor(board) {
		this.board = board;

		this.canvas = document.getElementById('borders');
		this.ctx = this.canvas.getContext('2d');

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.setLine = [];

		this.indicatorData = null;
		this.refinedCoords = null;
		this.doRender = false;

		this.startListeners();
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
	}

	startListeners() {
		this.canvas.addEventListener('mousemove', throttle(this.indicateLine, 30, this));
		this.canvas.addEventListener('mouseover', this.startIndicatorRender.bind(this));
		this.canvas.addEventListener('mouseout', this.stopIndicatorRender.bind(this));
		this.canvas.addEventListener('click', this.placeLine.bind(this));
	}

	indicateLine(e) {
		if(this.board.active) {
			var coords = this.getLinePosition(e.offsetX, e.offsetY, e.movementX, e.movementY);
			if(this.coordsChanged(coords)) {
				this.setIndicatorData(coords);
			}
		}
	}

	placeLine() {
		if(this.board.active && this.placementAllowed()) {
			this.setLine.push(this.refinedCoords);
			this.board.claimBorder(this.indicatorData);
		}
	}

	placementAllowed() {
		var allowed = true;
		var checkCoords = this.refinedCoords;

		for(var a = 0; a < this.setLine.length; a++) {
			if(JSON.stringify(checkCoords) === JSON.stringify(this.setLine[a])) {
				allowed = false;
			}
		}

		return allowed;
	}

	getLinePosition(x, y, moveX, moveY) {
		var trackX = Math.floor((x * 1.6) / 100) + 1;
		var trackY = Math.floor((y * 1.6) / 100) + 1;
		var side = "";
		var track = "";

		if(moveX < 0 && moveX < moveY) side = "left";
		else if(moveX > 0 && moveX > moveY) side = "right";
		else if(moveX < moveY && moveY < 0) side = "up";
		else if(moveX < moveY && moveY > 0) side = "down";

		if(side === "left" || side === "right") {
			track = "x";
			trackY = trackY > 9 ? 9 : trackY;
		}
		else {
			track = "y";
			trackX = trackX > 9 ? 9 : trackX;
		}

		return {
			x: trackX,
			y: trackY,
			track: track
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
		if(this.doRender && this.board.active) {
			requestAnimationFrame(this.drawIndicator.bind(this));
		}
	}

	drawIndicator() {
		this.clear();
		this.renderInitial();
		this.drawClaimed();
		this.refinedCoords = this.getRefinedCoords();
		this.drawLine(this.refinedCoords, '#999999');

		this.renderIndicator();
	}

	drawClaimed() {
		for(var c = 0; c < this.setLine.length; c++) {
			this.drawLine(this.setLine[c]);
		}
	}

	drawLine(coords, color = '#444444') {
		this.ctx.beginPath();
		this.ctx.moveTo.apply(this.ctx, coords.from);
		this.ctx.lineTo.apply(this.ctx, coords.to);
		this.ctx.lineWidth = 4;
		this.ctx.strokeStyle = color;
		this.ctx.stroke();
	}

	getRefinedCoords() {
		var coords = this.indicatorData;
		var x = coords.x;
		var y = coords.y;
		var coord = {};

		if(coords.track === "y") {
			coord = {
				from: [x * 60, (y - 1) * 60],
				to: [x * 60, y * 60]
			}
		}
		if(coords.track === "x") {
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