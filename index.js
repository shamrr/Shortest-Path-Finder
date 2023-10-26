const grid = document.querySelector('.grid');
const overlay = document.querySelector('.overlay');
const arrow = document.querySelector('.arrow');
const modalResult = document.querySelector('.modal-result');
const numRows = 100;
const numCols = 100;

let start = null;
let end = null;
let clickCount = 0;
let obstacleMode = false;

const cellField = [];

//определяем класс
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false;
    }
}

//заполняем поле необходимым кол-вом клеток и заполняем массив объектами
function fillCellField() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cellField.push(new Cell(i, j));
        }
    }
    addEventListeners();
}

function addEventListeners() {
    grid.addEventListener('mousedown', handleGridMousedown);
    grid.addEventListener('mouseup', handleGridMouseup);
    grid.addEventListener('click', handleGridClick);
}

function handleGridMousedown(event) {
    const { target } = event;

    if (target.style.backgroundColor === 'black') {
        obstacleMode = true;
    }
}

function handleGridMouseup() {
    obstacleMode = false;
}

function handleGridClick(event) {
    clickCount++;
    const { target } = event;

    if (obstacleMode) {
        setColor(target, 'black');
    } else {
        if (clickCount === 1) {
            setColor(target, 'green');
        } else if (clickCount === 2) {
            setColor(target, 'red');
            arrow.classList.add('active');
        } else {
            setColor(target, 'black');
        }
    }
}

//устанавливаем цвет фона для элемента в dom 
function setColor(cell, color) {
    cell.style.backgroundColor = color;
}

function findPath() {
    const startTime = performance.now(); // Засекаем время начала поиска пути
    let pathFound = false;
    const queue = [];

    start = cellField.find(cell => getCellElement(cell).style.backgroundColor === 'green');
    end = cellField.find(cell => getCellElement(cell).style.backgroundColor === 'red');

    arrow.classList.remove('active');

    queue.push(start);
    start.visited = true;

    while (queue.length > 0) {
        const currentCell = queue.shift();

        if (currentCell === end) {
            break;
        }

        const neighbors = getNeighbors(currentCell);

        for (const neighbor of neighbors) {
            if (getCellElement(neighbor).style.backgroundColor !== 'black' && !neighbor.visited) {
                neighbor.visited = true;
                neighbor.previous = currentCell;
                queue.push(neighbor);
            }
        }
    }

    let pathCell = end;
    while (pathCell.previous) {
        setColor(getCellElement(pathCell), '#33462f');
        pathCell = pathCell.previous;
    }

    if(end.visited) {
        pathFound = true;
    }

    const endTime = performance.now(); // Засекаем время окончания поиска пути
    const timeElapsed = endTime - startTime; // Вычисляем время выполнения

    // Обновляем время в модальном окне
    const timeElement = document.querySelector('.modal__time');
    timeElement.textContent = timeElapsed.toFixed(2) + ' ms';



    if(pathFound) {
        // Показываем модальное окно
        setTimeout(() =>{
            overlay.classList.remove('active');
            modalResult.classList.add('active');
        }, 2000)
    } else {
        alert('Impossible to build a path');
        resetData();
    }
}


//функция для получения всех соседей клетки
function getNeighbors(cell) {
    const neighbors = [];
    const { row, col } = cell;

    if (row > 0) {
        neighbors.push(cellField.find(c => c.row === row - 1 && c.col === col));
    }
    if (row < numRows - 1) {
        neighbors.push(cellField.find(c => c.row === row + 1 && c.col === col));
    }
    if (col > 0) {
        neighbors.push(cellField.find(c => c.row === row && c.col === col - 1));
    }
    if (col < numCols - 1) {
        neighbors.push(cellField.find(c => c.row === row && c.col === col + 1));
    }

    return neighbors;
}

function getCellElement(cell) {
    const index = cell.row * numCols + cell.col;
    return grid.children[index];
}

//сброс данных для возможности рассчитать новый путь
function resetData() {
    clickCount = 0;
    cellField.forEach((cell) => {
        cell.visited = false;
        delete cell.previous;
        setColor(getCellElement(cell), '');
    });
}

//функция для закрытия модального окна с правильами
function startPlay() {
    const btnStart = document.querySelector('.btn__start');

    btnStart.addEventListener('click', () => {
        overlay.classList.add('active')
    });
}

//функция для того чтобы закрыть модальное окно с результатом
function closePopup() {
    modalResult.classList.remove('active');
    overlay.classList.add('active')
}

fillCellField();
