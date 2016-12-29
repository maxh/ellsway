class Board {
  constructor(rowCount, colCount) {
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.model = this._getRandomModel();
  }

  step() {
    var newModel = this._getEmptyModel();
    for (var r = 0; r < this.rowCount; r++) {
      for (var c = 0; c < this.colCount; c++) {
        var neighbors = this._getNeighborCount(r, c);
        if (this.model[r][c] && (neighbors < 2 || neighbors > 3) ) {
          newModel[r][c] = 0;
        } else if (!this.model[r][c] && neighbors === 3) {
          newModel[r][c] = 1;
        } else {
          newModel[r][c] = this.model[r][c];
        }
      }
    }
    this.model = newModel;
  }

  _getNeighborCount(r, c) {
    var neighbors = 0;
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if ((dc === 0 && dr === 0) ||
            (r + dr < 0 || r + dr >= this.rowCount) ||
            (c + dc < 0 || c + dc >= this.colCount)) {
          continue;
        }
        neighbors += this.model[r + dr][c + dc];
      }
    }
    return neighbors;
  }

  _getEmptyModel() {
    var model = [];
    for (var r = 0; r < this.rowCount; r++) {
      model.push([]);
    }
    return model;
  }

  _getRandomModel() {
    var model = this._getEmptyModel();
    for (var r = 0; r < this.rowCount; r++) {
      for (var c = 0; c < this.colCount; c++) {
        model[r][c] = Math.random() >= .5 ? 1 : 0;
      }
    }
    return model;
  }
}

class BoardRenderer {
  constructor(board) {
    this.board = board;
  }

  createDom() {
    var tbody = document.querySelector('.cells');
    tbody.innerHTML = '';
    for (var r = 0; r < this.board.rowCount; r++) {
      var row = tbody.appendChild(document.createElement('tr'));
      for (var c = 0; c < this.board.colCount; c++) {
        var cell = document.createElement('td');
        cell.classList.add(BoardRenderer.getClass(r, c));
        row.appendChild(cell);
      }
    }
  }

  updateDom() {
    for (var r = 0; r < this.board.rowCount; r++) {
      for (var c = 0; c < this.board.colCount; c++) {
        var cell = document.querySelector('.' + BoardRenderer.getClass(r, c));
        if (this.board.model[r][c]) {
          cell.style.backgroundColor = BoardRenderer.getRandomColor();
        } else {
          cell.style.backgroundColor = '#000';
        }
      }
    }
  }

  static getClass(r, c) {
    return 'cell-' + r + '-' + c;
  }

  static getColumnsNeeded(rows) {
    var ratio = window.innerWidth / window.innerHeight;
    var columns = rows * ratio;
    return Math.ceil(columns);
  }

  static getRandomColor() {
    var COLORS = [
      'C35822',
      'AC3931',
      'C5A220',
      '41546E',
      '3F885C',
      '285038',
      'C45743',
      '393B49',
      '906567',
      '73212F',
      'C98504',
      '687F31'
    ];
    var index = Math.floor(Math.random() * (COLORS.length - .00001));
    return '#' + COLORS[index];
  }
}

(function() {
  var timer;

  function run() {
    clearTimeout(timer);

    var board = new Board(10, BoardRenderer.getColumnsNeeded(10));
    var renderer = new BoardRenderer(board);
    renderer.createDom();
    renderer.updateDom();

    var step = function() {
      board.step();
      renderer.updateDom();
      timer = setTimeout(step, 1000);
    };

    timer = setTimeout(step, 1000);
  }

  document.querySelector('.reset').addEventListener('click', run);
  run();
})();
