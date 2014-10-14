var Velocity = require('velocity-animate');
var $ = require('jquery');

class Cell {

	constructor(board, index, pos) {
		this.board = board;
		this.index = index;
		this.pos = pos;
		this.cell = this.template();
		this.claimed = false;
		this.owner = null;

		this.bordersClaimed = {
			top: false,
			left: false,
			right: false,
			bottom: false
		};
	}

	render(callback) {
		this.claimInitialBorders();
		this.board.addCell(this.cell);
		setTimeout(this.renderAnim.call(this, callback), Math.floor(Math.random() * 800) + 300);
	}

	renderAnim(callback) {
		var self = this;
		Velocity(this.cell[0], {
			translateY: ['0%', (Math.floor(Math.random() * 1000) + -1000) + '%'],
			translateX: ['0%', (Math.floor(Math.random() * 1000) + -1000) + '%'],
			opacity: 1
		}, {
			duration: Math.floor(Math.random() * 600) + 300,
			easing: 'easeOutBounce',
			begin: function() {
				self.cell.css({
					top: self.pos.y + '0.5%',
					left: self.pos.x + '0.5%'
				});
			},
			complete: callback
		});
	}

	claimInitialBorders() {
		if(this.pos.y === 0) {
			this.claimBorder("top");
		}
		if(this.pos.y === 9) {
			this.claimBorder("bottom");
		}
		if(this.pos.x === 9) {
			this.claimBorder("right");
		}
		if(this.pos.x === 0) {
			this.claimBorder("left");
		}
	}

	claimBorder(border) {
		this.bordersClaimed[border] = true;
	}

	template() {
		return $('<div class="cell" data-index="'+this.index+'" data-x="'+this.pos.x+'" data-y="'+this.pos.y+'"></div>');
	}
}

module.exports = Cell;