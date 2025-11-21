// ==========================
// SETTINGS
// ==========================
const SIZE = 5;
const SHIPS_COUNT = 3;

// SCOREBOARD
let playerWins = 0;
let computerWins = 0;

// ==========================
// GAME STATE
// ==========================
const game = {
  started: false,
  playerHits: 0,
  computerHits: 0,
};

// DOM
const msg = document.getElementById("message");
const playerEl = document.getElementById("player");
const computerEl = document.getElementById("computer");
const playBtn = document.getElementById("playBtn");

// Scoreboard DOM
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");

// ==========================
// HELPERS
// ==========================
function setMessage(t) {
  msg.textContent = t;
}

function coordsMatch(ship, r, c) {
  return ship.r === r && ship.c === c;
}

function containsShip(list, r, c) {
  return list.some((ship) => coordsMatch(ship, r, c));
}

function updateScoreboard() {
  playerScoreEl.textContent = playerWins;
  computerScoreEl.textContent = computerWins;
}

// ==========================
// BOARD FACTORY
// ==========================
function createBoardObject(container) {
  const board = {
    matrix: [],
    ships: [],
    element: container,
  };

  container.innerHTML = "";

  for (let r = 0; r < SIZE; r++) {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    const row = [];
    board.matrix.push(row);

    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;

      row.push(cell);
      rowDiv.appendChild(cell);
    }

    container.appendChild(rowDiv);
  }

  return board;
}

// ==========================
// SHIP FACTORY
// ==========================
function makeShip(r, c) {
  return { r, c };
}

// ==========================
// CREATE BOARDS
// ==========================
const playerBoard = createBoardObject(playerEl);
const computerBoard = createBoardObject(computerEl);

// ==========================
// PLACE COMPUTER SHIPS
// ==========================
function placeComputerShipsRandom() {
  computerBoard.ships = [];
  while (computerBoard.ships.length < SHIPS_COUNT) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!containsShip(computerBoard.ships, r, c)) {
      computerBoard.ships.push(makeShip(r, c));
    }
  }
}

placeComputerShipsRandom();

// ==========================
// PLAYER SHIP PLACEMENT (toggle)
// ==========================
let placedPlayerShips = 0;

function togglePlayerShip(r, c) {
  if (game.started) return;

  const cell = playerBoard.matrix[r][c];

  // remove ship if already placed
  if (cell.classList.contains("ship")) {
    cell.textContent = "";
    cell.classList.remove("ship");
    playerBoard.ships = playerBoard.ships.filter(
      (s) => !(s.r === r && s.c === c)
    );
    placedPlayerShips--;
    setMessage(
      `Скасовано. Розмістіть корабель ${placedPlayerShips + 1} з ${SHIPS_COUNT}`
    );
    return;
  }

  // max ships reached
  if (placedPlayerShips >= SHIPS_COUNT) return;

  // place ship
  cell.textContent = "🚢";
  cell.classList.add("ship");
  playerBoard.ships.push(makeShip(r, c));
  placedPlayerShips++;

  if (placedPlayerShips === SHIPS_COUNT) {
    setMessage("Усі кораблі розміщено. Натисніть 'Грати'.");
    playBtn.textContent = "Грати";
  } else {
    setMessage(`Розмістіть корабель ${placedPlayerShips + 1} з ${SHIPS_COUNT}`);
  }
}

// ==========================
// PLAYER ATTACK
// ==========================
function playerAttack(r, c) {
  if (!game.started) return;

  const cell = computerBoard.matrix[r][c];
  if (cell.classList.contains("disabled")) return;

  cell.classList.add("disabled");

  if (containsShip(computerBoard.ships, r, c)) {
    cell.textContent = "💥";
    cell.classList.add("hit");
    game.playerHits++;
    setMessage("Влучили!");
  } else {
    cell.classList.add("miss");
    setMessage("Мимо.");
  }

  if (checkWin()) return;

  setTimeout(computerMove, 600);
}

// ==========================
// COMPUTER MOVE
// ==========================
function computerMove() {
  if (!game.started) return;

  let r, c, cell;
  do {
    r = Math.floor(Math.random() * SIZE);
    c = Math.floor(Math.random() * SIZE);
    cell = playerBoard.matrix[r][c];
  } while (cell.classList.contains("hit") || cell.classList.contains("miss"));

  if (containsShip(playerBoard.ships, r, c)) {
    cell.textContent = "💥";
    cell.classList.add("hit");
    game.computerHits++;
    setMessage("Комп'ютер влучив!");
  } else {
    cell.classList.add("miss");
    setMessage("Комп'ютер промахнувся.");
  }

  checkWin();
}

// ==========================
// REVEAL ENEMY SHIPS
// ==========================
function revealComputerShips() {
  computerBoard.ships.forEach((ship) => {
    const cell = computerBoard.matrix[ship.r][ship.c];
    if (!cell.classList.contains("hit")) {
      cell.textContent = "🚢";
      cell.classList.add("revealed");
    }
  });
}

// ==========================
// CHECK WIN
// ==========================
function checkWin() {
  if (game.playerHits === SHIPS_COUNT) {
    setMessage("ВИ ВИГРАЛИ! 🎉");
    playerWins++;
    updateScoreboard();

    game.started = false;
    playBtn.textContent = "Грати знову";

    // disable boards
    playerBoard.element.style.pointerEvents = "none";
    computerBoard.element.style.pointerEvents = "none";
    return true;
  }

  if (game.computerHits === SHIPS_COUNT) {
    setMessage("КОМП'ЮТЕР ВИГРАВ!");
    computerWins++;
    updateScoreboard();

    revealComputerShips();
    game.started = false;
    playBtn.textContent = "Грати знову";

    playerBoard.element.style.pointerEvents = "none";
    computerBoard.element.style.pointerEvents = "none";
    return true;
  }

  return false;
}

// ==========================
// RESET GAME
// ==========================
function resetGame() {
  game.started = false;
  game.playerHits = 0;
  game.computerHits = 0;

  placedPlayerShips = 0;
  playerBoard.ships = [];
  computerBoard.ships = [];

  playerBoard.element.style.pointerEvents = "auto";
  computerBoard.element.style.pointerEvents = "auto";

  playerBoard.matrix.forEach((row) =>
    row.forEach((cell) => {
      cell.textContent = "";
      cell.className = "cell";
    })
  );

  computerBoard.matrix.forEach((row) =>
    row.forEach((cell) => {
      cell.textContent = "";
      cell.className = "cell";
    })
  );

  placeComputerShipsRandom();
  setMessage("Розмістіть корабель 1 з 3.");
  playBtn.textContent = "Грати";
}

// ==========================
// PLAY BUTTON
// ==========================
playBtn.onclick = () => {
  if (
    !game.started &&
    (game.playerHits === SHIPS_COUNT || game.computerHits === SHIPS_COUNT)
  ) {
    resetGame();
    return;
  }

  if (placedPlayerShips < SHIPS_COUNT) {
    setMessage("Спочатку розмістіть всі кораблі!");
    return;
  }

  if (!game.started) {
    game.started = true;
    playerBoard.element.style.pointerEvents = "none"; // can't change ships anymore
    computerBoard.element.style.pointerEvents = "auto"; // now clickable for attacks
    playBtn.textContent = "Почати з початку";
    setMessage("Гра почалась! Атакуйте!");
    return;
  }

  resetGame();
};

// ==========================
// CLICK LISTENERS
// ==========================
playerBoard.matrix.forEach((row, r) => {
  row.forEach((cell, c) => {
    cell.onclick = () => togglePlayerShip(r, c);
  });
});

computerBoard.matrix.forEach((row, r) => {
  row.forEach((cell, c) => {
    cell.onclick = () => playerAttack(r, c);
  });
});

// INIT
playBtn.textContent = "Грати";
setMessage("Розмістіть корабель 1 з 3.");
updateScoreboard();
computerBoard.element.style.pointerEvents = "none";
