/*
    ПОЧАТОК ПРОГРАМИ

1. Встановити константи:
   - SIZE = 5          // розмір поля
   - MAX_SHIPS = 3     // максимальна кількість кораблів

2. Ініціалізувати змінну:
   - ship_count = 0    // лічильник розміщених кораблів

3. Отримати DOM-елемент:
   - playerBoard       // контейнер для поля гравця
*/

const SIZE = 5;
const MAX_SHIPS = 3;

let ship_count = 0;

const playerBoard = document.getElementById("player");

/*
    СТВОРЕННЯ ІГРОВОГО ПОЛЯ + МАТРИЦІ

4. Функція createBoardAndMatrix(board):

     - Створити порожню матрицю matrix

     - Для кожного рядка i від 0 до SIZE-1:

         • Створити елемент row (рядок на полі)
         • Створити порожній matrixRow

         - Для кожної клітинки j від 0 до SIZE-1:

               ◦ Створити елемент cell
               ◦ Додати клас "cell"
               ◦ Додати властивість cell.hasShip = false
               ◦ Додати cell у row
               ◦ Додати cell у matrixRow

         • Додати row у board
         • Додати matrixRow у matrix

     - Повернути matrix

    5. Викликати createBoardAndMatrix(playerBoard) → playerMatrix
*/

/*
matrix = [
  [cell1, cell2, cell3, cell4, cell5],
  [cell6, cell7, cell8, cell9, cell10],
  [cell11, cell12, cell13, cell14, cell15],
  [cell16, cell17, cell18, cell19, cell20],
  [cell21, cell22, cell23, cell24, cell25]
] 
*/

function createBoardAndMatrix(board) {
  const matrix = [];

  for (let i = 0; i < SIZE; i++) {
    const boardRow = document.createElement("div");
    const matrixRow = [];

    for (let j = 0; j < SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.hasShip = false;
      boardRow.appendChild(cell);
      matrixRow.push(cell);
    }

    board.appendChild(boardRow);
    matrix.push(matrixRow);
  }

  return matrix;
}

const playerMatrix = createBoardAndMatrix(playerBoard);

// playerBoard.children[0].children[1].style.backgroundColor = "gold";
// playerBoard.children[3].children[3].style.backgroundColor = "hotpink";

// playerMatrix[0][0].style.backgroundColor = "white";
// playerMatrix[4][4].style.backgroundColor = "coral";

/*
    РОЗМІЩЕННЯ / СКАСУВАННЯ КОРАБЛІВ

6. Для кожної клітинки cell у playerMatrix:

     - Призначити cell.onclick:

           • Якщо cell.hasShip == true:
                 - Очистити текст клітинки
                 - Встановити cell.hasShip = false
                 - Зменшити ship_count на 1

           • Інакше, якщо ship_count < MAX_SHIPS:
                 - Додати текст "🚢" у клітинку
                 - Встановити cell.hasShip = true
                 - Збільшити ship_count на 1
*/

playerMatrix.forEach((row) => {
  row.forEach((cell) => {
    cell.onclick = () => {
      if (cell.hasShip === true) {
        cell.textContent = "";
        cell.hasShip = false;
        ship_count--;
      } else if (ship_count < MAX_SHIPS) {
        cell.textContent = "🚢";
        cell.hasShip = true;
        ship_count++;
      }
    };
  });
});
