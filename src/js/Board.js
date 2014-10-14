var Cell = require('./Cell');
var Borders = require('./Borders');
var $ = require('jquery');

class Board {

	constructor() {
		this.$board = $('#board');
		this.grid = [];
		this.cells = [];
		this.renderedCells = 0;
		this.borders = {};
	}

	render(size) {
		this.createGrid(size);
		this.borders = new Borders(this, this.grid);

		for(var c = 0; c < this.grid.length; c++) {
			var pos = this.grid[c];
			var cell = new Cell(this, c, pos);

			this.cells.push(cell);

			cell.render(this.cellRendered.bind(this));
		}

		this.borders.renderInitial();
	}

	addCell(cell) {
		this.$board.append(cell);
	}

	createGrid(size) {
		var x = 0;
		var y = 0;
		var grid = [];

		for(; y < size; y++) {
			x = 0;

			var coordVert = {
				y: y,
				x: x
			};

			grid.push(coordVert);

			for(; x < size; x++) {
				if(x !== 0) {
					var coordHorz = {
						y: y,
						x: x
					}

					grid.push(coordHorz);
				}
			}
		}

		this.grid = grid;
	}

	cellRendered() {
		this.renderedCells++;

		if(this.renderedCells === this.cells.length) {
			this.allCellsRendered();
		}
	}

	allCellsRendered() {
		$(window).trigger('boardrendered');
	}
}

module.exports = Board;