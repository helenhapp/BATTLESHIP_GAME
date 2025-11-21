/* 
   ПОЧАТОК ПРОГРАМИ

1. Встановити константи:
   - SIZE = 5           // розмір поля
   - MAX_SHIPS = 3      // максимальна кількість кораблів

2. Ініціалізувати змінну:
   - ship_count = 0     // лічильник розміщених кораблів

3. Отримати DOM-елемент:
   - playerBoard        // контейнер для поля гравця
*/

const SIZE = 5;
const MAX_SHIPS = 3;

let ship_count = 0;

const playerBoard = document.getElementById("player");

/* 
   СТВОРЕННЯ ІГРОВОГО ПОЛЯ

4. Функція createBoard(board):
   - Для кожного рядка i від 0 до SIZE-1:
       • створити контейнер row

       - Для кожної клітинки j від 0 до SIZE-1:
           • створити cell
           • додати cell до row

       • додати row до board

5. Викликати createBoard(playerBoard)
*/

function createBoard(board) {
  for (let i = 0; i < SIZE; i++) {
    const row = document.createElement("div");
    // row.classList.add("row");

    for (let j = 0; j < SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
    }

    board.appendChild(row);
  }
}

createBoard(playerBoard);

/* 
   СТВОРЕННЯ МАТРИЦІ КЛІТИНОК

6. Функція createMatrix(board):
   - Ініціалізувати порожню матрицю matrix

   - Для кожного рядка i у board:
       • Ініціалізувати порожній рядок matrixRow

       - Для кожної клітинки j у рядку i:
           • додати клітинку до matrixRow

       • додати matrixRow до matrix

   - Повернути matrix

7. Викликати createMatrix(playerBoard) → playerMatrix
*/

function createMatrix(board) {
  const matrix = [];

  for (let i = 0; i < SIZE; i++) {
    const boardRow = board.children[i];
    const matrixRow = [];

    for (let j = 0; j < SIZE; j++) {
      const cell = boardRow.children[j];
      matrixRow.push(cell);
    }

    matrix.push(matrixRow);
  }

  return matrix;
}

const playerMatrix = createMatrix(playerBoard);

/* 
   РОЗМІЩЕННЯ / СКАСУВАННЯ КОРАБЛІВ 

8. Для кожної клітинки cell у playerMatrix:

   - Додати властивість cell.hasShip = false

   - Встановити onclick функцію:

       • Якщо cell.hasShip == true:
           - Очистити текст клітинки
           - Встановити cell.hasShip = false
           - Зменшити ship_count на 1

       • Інакше, якщо ship_count < MAX_SHIPS:
           - Установити текст "🚢" у клітинці
           - Встановити cell.hasShip = true
           - Збільшити ship_count на 1
*/

playerMatrix.forEach((row) => {
  row.forEach((cell) => {
    cell.hasShip = false;

    cell.onclick = () => {
      if (cell.hasShip) {
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
