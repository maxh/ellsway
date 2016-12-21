function run() {
  var board = createBoard(10, 10);
  createBoardDom(board);
  var step = function() {
    board = stepBoard(board);
    updateBoardDom(board);
    setTimeout(step, 1000);
  };
  setTimeout(step, 1000);
}

function createBoard(rowCount, colCount) {
  var board = [];
  for (var r = 0; r < rowCount; r++) {
    board.push([]);
    for (var c = 0; c < colCount; c++) {
      board[r][c] = Math.random() >= .5 ? 1 : 0;
    }
  }
  return board;
}

function stepBoard(board) {
  var newBoard = [];
  board.forEach(function(row) {
    newBoard.push([]);
  });

  var rowCount = board.length;
  var colCount = board[0].length;
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < colCount; c++) {

      var neighbors = 0;
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if ((dc == 0 && dr == 0) ||
              (r + dr < 0 || r + dr >= rowCount) ||
              (c + dc < 0 || c + dc >= colCount)) {
            continue;
          }
          neighbors += board[r + dr][c + dc];
        }
      }

      if (board[r][c] && neighbors != 2) {
        newBoard[r][c] = 0;
      } else if (!board[r][c] && neighbors == 2) {
        newBoard[r][c] = 1;
      } else {
        newBoard[r][c] = board[r][c];
      }
    }
  }

  return newBoard;
};

function printBoard(board) {
  console.log('');
  board.forEach(function(row) {
    console.log(row.join(''));
  })
}

function createBoardDom(board) {
  var tbody = document.querySelector('.cells');
  board.forEach(function(row, r) {
    var row = tbody.appendChild(document.createElement('tr'));
    board.forEach(function(col, c) {
      var cell = document.createElement('td');
      cell.classList.add(getClass(r, c));
      row.appendChild(cell);
    })
  })
}

function getClass(r, c) {
  return 'cell-' + r + '-' + c;
}

function updateBoardDom(board) {
  board.forEach(function(row, r) {
    board.forEach(function(col, c) {
      var cell = document.querySelector('.' + getClass(r, c));
      if (board[r][c]) {
        cell.classList.add('alive');
      } else {
        cell.classList.remove('alive');
      }
    });
  })
}

run();