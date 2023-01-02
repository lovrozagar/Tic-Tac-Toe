/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */

const ticTacToe = (() => {
  // MODAL
  const pregameModal = document.querySelector('#modal-pregame');
  const overlay = document.getElementById('overlay');
  const winModal = document.querySelector('#modal-win');

  function openModal(typeOfModal) {
    if (typeOfModal == null) return;
    typeOfModal.classList.add('active');
    overlay.classList.add('active');
  }

  function closeModal(typeOfModal) {
    if (typeOfModal == null) return;
    typeOfModal.classList.remove('active');
    overlay.classList.remove('active');
  }

  const board = ['', '', '', '', '', '', '', '', ''];
  const wins = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const personFactory = (player, name, sign, score) => {
    return { player, name, sign, score };
  };

  let player1 = {};
  let player2 = {};
  const playerArray = [];

  let whoIsOnTurn = 'player1';

  function max(a, b) {
    if (a > b) {
      return a;
    }
    return b;
  }

  function min(a, b) {
    if (a < b) {
      return a;
    }
    return b;
  }

  function checkForTie() {
    for (let i = 0; i < board.length; i += 1) {
      if (board[i] === '') {
        return false;
      }
    }
    return 'tie';
  }

  function checkForWin() {
    for (let i = 0; i < wins.length; i += 1) {
      let inRowX = 0;
      let inRowO = 0;
      for (let j = 0; j < wins[0].length; j += 1) {
        if (board[wins[i][j]] === 'X') {
          inRowX += 1;
          if (inRowX === 3) {
            return 'X';
          }
        } else if (board[wins[i][j]] === 'O') {
          inRowO += 1;
          if (inRowO === 3) {
            return 'O';
          }
        }
      }
    }
    return false;
  }

  const scores = {
    X: -10,
    O: 10,
    tie: 0,
  };

  function minimax(depth, isMaximizing) {
    let thisBot = '';
    let opponent = '';
    if (whoIsOnTurn === 'player1') {
      thisBot = 'X';
      opponent = 'O';
    } else {
      thisBot = 'O';
      opponent = 'X';
    }

    const win = checkForWin();
    const tie = checkForTie();
    if (win === 'X' || win === 'O') {
      return scores[win];
    }
    if (tie === 'tie') {
      return scores[tie];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i += 1) {
        // Is the spot available?
        if (board[i] === '') {
          board[i] = thisBot;
          const score = minimax(depth + 1, false);
          board[i] = '';
          bestScore = max(score, bestScore);
        }
      }
      return bestScore;
    }
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i += 1) {
      // Is the spot available?
      if (board[i] === '') {
        board[i] = opponent;
        const score = minimax(depth + 1, true);
        board[i] = '';
        bestScore = min(score, bestScore);
      }
    }
    return bestScore;
  }

  function bestMove() {
    let thisBot = '';
    if (whoIsOnTurn === 'player1') {
      thisBot = 'X';
    } else {
      thisBot = 'O';
    }
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i += 1) {
      if (board[i] === '') {
        board[i] = thisBot;
        const score = minimax(0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i };
        }
      }
    }

    board[move.i] = thisBot;
    if (whoIsOnTurn === 'player1') {
      whoIsOnTurn = 'player2';
    } else {
      whoIsOnTurn = 'player1';
    }
  }

  // ------------------------------------

  function minimaxi(depth, isMaximizing) {
    const win = checkForWin();
    const tie = checkForTie();
    if (win === 'X' || win === 'O') {
      return scores[win];
    }
    if (tie === 'tie') {
      return scores[tie];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i += 1) {
        // Is the spot available?
        if (board[i] === '') {
          board[i] = 'O';
          const score = minimax(depth + 1, false);
          board[i] = '';
          bestScore = max(score, bestScore);
        }
      }
      return bestScore;
    }
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i += 1) {
      // Is the spot available?
      if (board[i] === '') {
        board[i] = 'X';
        const score = minimax(depth + 1, true);
        board[i] = '';
        bestScore = min(score, bestScore);
      }
    }
    return bestScore;
  }

  function bestMoves() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i += 1) {
      if (board[i] === '') {
        board[i] = 'O';
        const score = minimaxi(0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i };
        }
      }
    }
    board[move.i] = 'X';
    if (whoIsOnTurn === 'player1') {
      whoIsOnTurn = 'player2';
    } else {
      whoIsOnTurn = 'player1';
    }
  }

  function addXorOClass(field) {
    if (whoIsOnTurn === 'player1') {
      field.classList.remove('o');
      field.classList.add('x');
      return;
    }
    field.classList.remove('x');
    field.classList.add('o');
  }

  function setHoverOfCurrentPlayerOnBoard(gameFields) {
    gameFields.forEach((field) => {
      if (field.textContent === '') {
        addXorOClass(field);
        field.style.pointerEvents = 'auto';
      }
    });
  }

  function playPlayersTurn() {
    if (whoIsOnTurn === 'player1') {
      whoIsOnTurn = 'player2';
      return 'X';
    }
    whoIsOnTurn = 'player1';
    return 'O';
  }

  function updateBoardArray(gameFields) {
    let i = 0;
    gameFields.forEach((field) => {
      if (field.textContent !== null || field.textContent !== '') {
        board[i] = field.textContent;
        i += 1;
      }
    });
  }

  function setSignColor(sign, field) {
    if (sign === 'X') {
      field.style.color = '#1F51FF';
    } else {
      field.style.color = '#D22B2B';
    }
  }

  function updateBoardFields(gameFields) {
    for (let i = 0; i < board.length; i += 1) {
      gameFields[i].textContent = board[i];
      setSignColor(gameFields[i].textContent, gameFields[i]);
    }
  }

  function printTieMessage() {
    openModal(winModal);
    const winMessage = document.querySelector('#winning-message');
    winMessage.textContent = `It's a Tie! XOXO`;
  }

  function printWinMessage() {
    openModal(winModal);
    const winMessage = document.querySelector('#winning-message');
    if (whoIsOnTurn === 'player2') {
      winMessage.textContent = `${player1.name} wins! XOXO`;
    } else {
      winMessage.textContent = `${player2.name} wins! XOXO`;
    }
  }

  function checkIfEmptyField(field) {
    if (field.textContent) {
      return false;
    }
    field.textContent = playPlayersTurn();
    setSignColor(field.textContent, field);
    return true;
  }

  function setPlayerNames() {
    const x = document.querySelector('#score-x');
    const o = document.querySelector('#score-o');
    x.textContent = `${playerArray[0].name} (X): ${playerArray[0].score}`;
    o.textContent = `${playerArray[1].name} (O): ${playerArray[1].score}`;
  }

  function incrementWinner(winner) {
    if (winner === 'X') {
      playerArray[0].score += 1;
    }
    if (winner === 'O') {
      playerArray[1].score += 1;
    }
  }

  function continueGame() {
    const gameFields = document.querySelectorAll('.play-field');
    updateBoardArray(gameFields);
    const winner = checkForWin();
    if (winner) {
      incrementWinner(winner);
      setPlayerNames();
      if (playerArray[0].score === 5 || playerArray[1].score === 5) {
        printWinMessage();
      }
      return true;
    }
    if (checkForTie()) {
      return true;
    }
    setHoverOfCurrentPlayerOnBoard(gameFields);
    return false;
  }

  function removeListenersIfEnd(gameFields) {
    if (continueGame()) {
      gameFields.forEach((n) => {
        n.classList.remove('o');
        n.classList.remove('x');
        n.style.pointerEvents = 'none';
      });
    }
  }

  function cpuPlaysOinMiddleIfEmpty() {
    if (board[4] === '') {
      board[4] = 'O';
      whoIsOnTurn = 'player1';
      return;
    }
    bestMove();
  }

  function cpuPlaysXinMiddleIfEmpty() {
    if (board[4] === '') {
      board[4] = 'X';
      whoIsOnTurn = 'player2';
      return;
    }
    bestMoves();
  }

  function resetGame() {
    const resetButton = document.querySelector('#btn-reset');
    resetButton.addEventListener('click', () => {
      for (let i = 0; i < board.length; i += 1) {
        board[i] = '';
      }
      const gameFields = document.querySelectorAll('.play-field');
      updateBoardFields(gameFields);
      whoIsOnTurn = 'player1';
      turn();
    });
  }

  function returnToMainMenu() {
    const returnButton = document.querySelector('#refresh');
    returnButton.addEventListener('click', () => {
      location.reload();
      return false;
    });
  }

  function turn() {
    returnToMainMenu();

    const x = 0;
    const o = 1;
    const gameFields = document.querySelectorAll('.play-field');

    setHoverOfCurrentPlayerOnBoard(gameFields);
    // If P1 is player and P2 is player &&
    // If P1 is player and P2 is CPu
    if (
      playerArray[x].player === 'Player' &&
      (playerArray[o].player === 'Player' || playerArray[o].player === 'CPU')
    ) {
      gameFields.forEach((field) => {
        field.addEventListener('click', () => {
          if (checkIfEmptyField(field)) {
            updateBoardArray(gameFields);
            removeListenersIfEnd(gameFields);
            if (playerArray[o].player === 'CPU') {
              cpuPlaysOinMiddleIfEmpty();
              updateBoardFields(gameFields);
              removeListenersIfEnd(gameFields);
            }
          }
        });
      });
    }
    // If P1 is CPU and P2 is player
    if (playerArray[x].player === 'CPU' && playerArray[o].player === 'Player') {
      cpuPlaysXinMiddleIfEmpty();
      updateBoardFields(gameFields);
      removeListenersIfEnd(gameFields);
      gameFields.forEach((field) => {
        field.addEventListener('click', () => {
          if (checkIfEmptyField(field)) {
            updateBoardArray(gameFields);
            removeListenersIfEnd(gameFields);
            if (playerArray[x].player === 'CPU') {
              cpuPlaysXinMiddleIfEmpty();
              updateBoardFields(gameFields);
              removeListenersIfEnd(gameFields);
            }
          }
        });
      });
    }

    if (playerArray[x].player === 'CPU' && playerArray[o].player === 'CPU') {
      while (!(checkForWin() || checkForTie())) {
        if (whoIsOnTurn === 'player1') {
          cpuPlaysXinMiddleIfEmpty();
          updateBoardFields(gameFields);
          if (checkForTie()) {
            removeListenersIfEnd(gameFields);
          }
        }
        if (whoIsOnTurn === 'player2') {
          cpuPlaysOinMiddleIfEmpty();
          updateBoardFields(gameFields);
          if (checkForTie()) {
            removeListenersIfEnd(gameFields);
          }
        }
      }
    }

    resetGame();
  }

  function pregame() {
    openModal(pregameModal);

    // Pregame button event listeners
    const gifPlayer1 = document.querySelector('#gif-player-1');
    const gifBot1 = document.querySelector('#gif-bot-1');
    const buttonPlayer1 = document.querySelector('#btn-player-1');
    const buttonBot1 = document.querySelector('#btn-bot-1');
    const namePlayer1 = document.querySelector('#name-player-1');

    buttonBot1.addEventListener('click', () => {
      gifPlayer1.classList.add('hidden');
      gifBot1.classList.remove('hidden');
      buttonPlayer1.classList.remove('selected');
      buttonBot1.classList.add('selected');
    });
    buttonPlayer1.addEventListener('click', () => {
      gifBot1.classList.add('hidden');
      gifPlayer1.classList.remove('hidden');
      buttonBot1.classList.remove('selected');
      buttonPlayer1.classList.add('selected');
    });

    const gifPlayer2 = document.querySelector('#gif-player-2');
    const gifBot2 = document.querySelector('#gif-bot-2');
    const buttonPlayer2 = document.querySelector('#btn-player-2');
    const buttonBot2 = document.querySelector('#btn-bot-2');
    const namePlayer2 = document.querySelector('#name-player-2');
    buttonBot2.addEventListener('click', () => {
      gifPlayer2.classList.add('hidden');
      gifBot2.classList.remove('hidden');
      buttonPlayer2.classList.remove('selected');
      buttonBot2.classList.add('selected');
    });
    buttonPlayer2.addEventListener('click', () => {
      gifBot2.classList.add('hidden');
      gifPlayer2.classList.remove('hidden');
      buttonBot2.classList.remove('selected');
      buttonPlayer2.classList.add('selected');
    });

    const buttonStartGame = document.querySelector('#btn-start-game');
    buttonStartGame.addEventListener('click', (event) => {
      // Player1 object creation
      let p1 = namePlayer1.value;
      if (namePlayer1.value === '') {
        p1 = 'P1';
      }
      if (buttonPlayer1.classList.contains('selected')) {
        player1 = personFactory('Player', p1, 'X', 0);
      } else {
        player1 = personFactory('CPU', p1, 'O', 0);
      }
      // Player2 object creation
      let p2 = namePlayer2.value;
      if (namePlayer2.value === '') {
        p2 = 'P2';
      }
      if (buttonPlayer2.classList.contains('selected')) {
        player2 = personFactory('Player', p2, 'X', 0);
      } else {
        player2 = personFactory('CPU', p2, 'O', 0);
      }
      playerArray.push(player1);
      playerArray.push(player2);
      closeModal(pregameModal);
      event.preventDefault();
      setPlayerNames();
      turn();
    });
  }

  // ------------------------------------

  function game() {
    pregame();
  }

  return { game, board, playerArray };
})();

ticTacToe.game();
