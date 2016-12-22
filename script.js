var timer;


function run() {
  clearTimeout(timer);

  var board = createBoard(10, getColumnsNeeded(10));
  createBoardDom(board);
  updateBoardDom(board);

  var step = function(board) {
    var newBoard = stepBoard(board);
    updateBoardDom(newBoard);
    timer = setTimeout(step.bind(null, newBoard), 1000);
  };

  timer = setTimeout(step.bind(null, board), 1000);
}

function createBoard(rowCount, colCount) {
  var board = createEmptyBoard(rowCount, colCount);
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      board[r][c] = Math.random() >= .5 ? 1 : 0;
    }
  }
  return board;
}

function createEmptyBoard(rowCount, colCount) {
  var board = [];
  for (var r = 0; r < rowCount; r++) {
    board.push([]);
  }
  return board;
}

function stepBoard(board) {
  var rowCount = board.length;
  var colCount = board[0].length;
  var newBoard = createEmptyBoard(rowCount, colCount);
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var neighbors = getNeighborCount(board, r, c);
      if (board[r][c] && (neighbors < 2 || neighbors > 3) ) {
        newBoard[r][c] = 0;
      } else if (!board[r][c] && neighbors === 3) {
        newBoard[r][c] = 1;
      } else {
        newBoard[r][c] = board[r][c];
      }
    }
  }
  return newBoard;
};

function getNeighborCount(board, r, c) {
  var neighbors = 0;
  var rowCount = board.length;
  var colCount = board[0].length;
  for (var dr = -1; dr <= 1; dr++) {
    for (var dc = -1; dc <= 1; dc++) {
      if ((dc === 0 && dr === 0) ||
          (r + dr < 0 || r + dr >= rowCount) ||
          (c + dc < 0 || c + dc >= colCount)) {
        continue;
      }
      neighbors += board[r + dr][c + dc];
    }
  }
  return neighbors;
}

function printBoard(board) {
  console.log('');
  board.forEach(function(row) {
    console.log(row.join(''));
  })
}

function createBoardDom(board) {
  var tbody = document.querySelector('.cells');
  tbody.innerHTML = '';
  var rowCount = board.length;
  var colCount = board[0].length;
  for (var r = 0; r < rowCount; r++) {
    var row = tbody.appendChild(document.createElement('tr'));
    for (var c = 0; c < colCount; c++) {
      var cell = document.createElement('td');
      cell.classList.add(getClass(r, c));
      row.appendChild(cell);
    }
  }
}

function getClass(r, c) {
  return 'cell-' + r + '-' + c;
}

function updateBoardDom(board) {
  var rowCount = board.length;
  var colCount = board[0].length;
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {
      var cell = document.querySelector('.' + getClass(r, c));
      if (board[r][c]) {
        cell.classList.add('alive');
      } else {
        cell.classList.remove('alive');
      }
    }
  }
}

function getColumnsNeeded(rows) {
  var ratio = window.innerWidth / window.innerHeight;
  var columns = rows * ratio;
  return Math.ceil(columns);
}

document.querySelector('.reset').addEventListener('click', run);

run();