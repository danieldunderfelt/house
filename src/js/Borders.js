function throttle(e,t,n){t||(t=250);var r,i;return function(){var s=n||this;var o=+(new Date),u=arguments;if(r&&o<r+t){clearTimeout(i);i=setTimeout(function(){r=o;e.apply(s,u)},t)}else{r=o;e.apply(s,u)}}}

class Borders {

	constructor(board, grid) {
		this.board = board;
		this.grid = grid;

		this.canvas = document.getElementById('borders');
		this.ctx = this.canvas.getContext('2d');

		this.width = this.canvas.width;
		this.height = this.canvas.height;
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
	}

	indicateLine(e) {
		this.clear();
		var coords = this.getLinePosition(e.offsetX, e.offsetY, e.movementX, e.movementY);
		this.drawLine(coords);
	}

	getLinePosition(x, y, moveX, moveY) {
		var posX = Math.round((x * 1.4) / 100) + 1;
		var posY = Math.round((y * 1.4) / 100) + 1;
		var dir = "up";

		if(moveX < 0 && moveX < moveY) dir = "left";
		if(moveX > 0 && moveX > moveY) dir = "right";
		if(moveX > moveX && moveY < 0) dir = "up";
		if(moveX < moveY && moveY > 0) dir = "down";

		console.log(dir);
	}

	drawLine(coords) {

	}

	clear() {
		this.ctx.clearRect(4, 4, this.canvas.width - 8, this.canvas.height - 8);
	}
}

module.exports = Borders;