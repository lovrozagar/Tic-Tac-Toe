/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
const ticTacToe = (() => {
  // MODAL
  const pregameModal = document.querySelector("#modal-pregame");
  const overlay = document.getElementById("overlay");
  const winModal = document.querySelector("#modal-win");

  function openModal(typeOfModal) {
    if (typeOfModal == null) return;
    typeOfModal.classList.add("active");
    overlay.classList.add("active");
  }

  function closeModal(typeOfModal) {
    if (typeOfModal == null) return;
    typeOfModal.classList.remove("active");
    overlay.classList.remove("active");
  }

  let player1;
  let player2;

  const gameBoard = {
    gameBoard: [],
    possibleWins: [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
  };

  const personFactory = (player, name) => {
    const sayHello = () => console.log("hello!");
    return { player, name, sayHello };
  };

  let whoIsOnTurn = "player1";

  function addXorOClass(field) {
    if (whoIsOnTurn === "player1") {
      field.classList.remove("o");
      field.classList.add("x");
      return;
    }
    field.classList.remove("x");
    field.classList.add("o");
  }

  function setHoverOfCurrentPlayerOnBoard(gameFields) {
    gameFields.forEach((field) => {
      if (field.textContent) {
        return;
      }
      addXorOClass(field);
    });
  }

  function playPlayersTurn() {
    if (whoIsOnTurn === "player1") {
      whoIsOnTurn = "player2";
      return "X";
    }
    whoIsOnTurn = "player1";
    return "O";
  }

  function updateBoardArray(gameFields) {
    let i = 0;
    gameFields.forEach((field) => {
      gameBoard.gameBoard[i] = field.textContent;
      i += 1;
    });
  }

  function updateBoardFields(gameFields) {
    for (let i = 0; i < gameBoard.gameBoard.length; i += 1) {
      gameFields[i].textContent = gameBoard.gameBoard[i];
    }
  }

  function printTieMessage() {
    openModal(winModal);
    const winMessage = document.querySelector("#winning-message");
    winMessage.textContent = `It's a Tie! XOXO`;
  }

  function printWinMessage() {
    openModal(winModal);
    const winMessage = document.querySelector("#winning-message");
    if (whoIsOnTurn === "player2") {
      winMessage.textContent = `${player1.name} wins! XOXO`;
    } else {
      winMessage.textContent = `${player2.name} wins! XOXO`;
    }
  }

  function checkIfBoardFullNoWinner() {
    for (let i = 0; i < gameBoard.gameBoard.length; i += 1) {
      if (gameBoard.gameBoard[i] === "") {
        return false;
      }
    }
    return true;
  }

  function checkForWin(character) {
    for (let i = 0; i < gameBoard.possibleWins.length; i += 1) {
      let inRow = 0;
      for (let j = 0; j < gameBoard.possibleWins[0].length; j += 1) {
        if (gameBoard.gameBoard[gameBoard.possibleWins[i][j]] === character) {
          console.log(gameBoard.gameBoard[gameBoard.possibleWins[i][j]]);
          inRow += 1;
        }
      }
      if (inRow === 3) {
        return character;
      }
    }
    return false;
  }

  function checkIfEmpty(field) {
    if (field.textContent) {
      return false;
    }
    return true;
  }

  function printPlayerOnTurnInFooter() {
    const footer = document.querySelector("#on-turn");
    if (whoIsOnTurn === "player1") {
      footer.textContent = `${player1.name}'s turn`;
      return;
    }
    footer.textContent = `${player2.name}'s turn`;
  }

  function pregame() {
    openModal(pregameModal);
    const submitButton = document.querySelector("#modal-pregame-submit-btn");
    const playerOneOption = document.querySelector("#player-or-cpu-1");
    const playerOneName = document.querySelector("#player-1");
    const playerTwoOption = document.querySelector("#player-or-cpu-2");
    const playerTwoName = document.querySelector("#player-2");
    submitButton.addEventListener("click", (event) => {
      if (
        playerOneOption.value !== null &&
        playerOneName.value !== "" &&
        playerTwoOption.value !== null &&
        playerTwoName.value !== "" &&
        playerOneName.value !== playerTwoName.value
      ) {
        event.preventDefault();
        player1 = personFactory(playerOneOption.value, playerOneName.value);
        player2 = personFactory(playerTwoOption.value, playerTwoName.value);
        console.log(player1, player2);
        closeModal(pregameModal);
        printPlayerOnTurnInFooter();
      }
    });
  }

  function cpuTurn() {
    const gameFields = document.querySelectorAll(".play-field");
    let i = 0;
    while (i < 30) {
      const randomIndex = Math.floor(
        Math.random() * gameBoard.gameBoard.length
      );
      if (gameBoard.gameBoard[randomIndex] === "") {
        gameBoard.gameBoard[randomIndex] = playPlayersTurn();
        if (checkForWin(gameBoard.gameBoard[randomIndex])) {
          printWinMessage();
        } else if (checkIfBoardFullNoWinner()) {
          printTieMessage();
        } else {
          printPlayerOnTurnInFooter();
          setHoverOfCurrentPlayerOnBoard(gameFields);
        }
        updateBoardFields(gameFields);
        break;
      }
      i += 1;
    }
  }

  function playerTurn() {
    const gameFields = document.querySelectorAll(".play-field");
    setHoverOfCurrentPlayerOnBoard(gameFields);
    gameFields.forEach((field) => {
      field.addEventListener("click", () => {
        if (checkIfEmpty(field)) {
          field.textContent = playPlayersTurn();
          updateBoardArray(gameFields);
          if (checkForWin(field.textContent)) {
            printWinMessage();
          } else if (checkIfBoardFullNoWinner()) {
            printTieMessage();
          } else {
            printPlayerOnTurnInFooter();
            setHoverOfCurrentPlayerOnBoard(gameFields);
          }
        }
        if (player2.player === "CPU") {
          cpuTurn();
        }
      });
    });
  }

  function game() {
    pregame();
    playerTurn();
  }

  return { game, gameBoard };
})();

ticTacToe.game(); 
