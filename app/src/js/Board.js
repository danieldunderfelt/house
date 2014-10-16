var Cell = require('./Cell');
var Borders = require('./Borders');
var $ = require('jquery');

class Board {

	constructor(game) {
		this.game = game;
		this.$board = $('#board');
		this.grid = [];
		this.cells = [];
		this.renderedCells = 0;
		this.borders = {};
	}

	claimBorder(coords) {
		var cellData = this.getCellFromLineCoords(coords);
		var neighbor = this.getCellNeighbor(cellData);

		var cellBorder = coords.track === "y" ? "right" : "bottom";
		var neighborBorder = coords.track === "y" ? "left" : "top";

		cellData.cell.claimBorder(cellBorder);
		neighbor.claimBorder(neighborBorder);
	}

	getCellFromLineCoords(coords) {
		var cell = null;
		var index = 0;

		for(var c = 0; c < this.cells.length; c++) {
			var cellCol = c % 10;
			var cellRow = Math.floor(c / 10);

			if(cellRow + 1 === coords.y && cellCol + 1 === coords.x) {
				cell = this.cells[c];
				index = c;
				break;
			}
		}

		return {
			cell: cell,
			index: index,
			track: coords.track
		};
	}

	getCellNeighbor(cellData) {
		if(cellData.track === "y") {
			return this.cells[cellData.index + 1];
		}
		else if(cellData.track = "x") {
			return this.cells[cellData.index + 10];
		}
		else return null;
	}

	render(size) {
		this.createGrid(size);
		this.borders = new Borders(this);

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