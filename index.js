const grid = document.querySelector('.grid');
const overlay = document.querySelector('.overlay');
let start = null;
let end = null;
const btnBuild = document.querySelector('.btn__build');
const arrow = document.querySelector('.arrow');
const cellField = [];
const numRows = 100;
const numCols = 100;

//определяем класс
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false;
    }
}

//заполняем клеточное поле в dom необходимым кол-вом ячеек и также жобавляем объект каждой ячейки с ее индексами в массив
function fillTheCeilField() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);

            cellField.push(new Cell(i, j));
        }
    }
    findStartAndEndElement();
}
fillTheCeilField();


//устанавливаем цвет фона для элемента в dom
function setColor(cell, color) {
    cell.style.backgroundColor = color;
}

function findStartAndEndElement() {
    let clickCount = 0;

    grid.addEventListener('click', (event) => {
        clickCount++;

        const { target } = event;

        if (clickCount === 1) {
            setColor(target, 'green');
        } else if (clickCount === 2) {
            setColor(target, 'red');
            arrow.classList.add('active');
        } else {
            setColor(target, 'black');
        }

        // if (clickCount > 2) {
        //     target.removeEventListener('click');
        // }
    });
}

//функция для нахождения пути минимального
function findPath() {
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
            if (!neighbor.visited) {
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
}

//функция для получения всех соседей клетки
function getNeighbors(cell) {
    const neighbors = [];
    const { row, col } = cell;

    if (row > 0) {
        neighbors.push(cellField.find((c) => c.row === row - 1 && c.col === col));
    }
    if (row < numRows - 1) {
        neighbors.push(cellField.find((c) => c.row === row + 1 && c.col === col));
    }
    if (col > 0) {
        neighbors.push(cellField.find((c) => c.row === row && c.col === col - 1));
    }
    if (col < numCols - 1) {
        neighbors.push(cellField.find((c) => c.row === row && c.col === col + 1));
    }

    return neighbors;
}   

function getCellElement(cell) {
    const index = cell.row * numCols + cell.col;
    return grid.children[index];
}

//фукнция для модального окна при открытии страницы
function startPlay() {
    const btnPlay = document.querySelector('.btn__start');

    btnPlay.addEventListener('click', () => {
        overlay.classList.toggle('active')
    });

   
}

//функция для сброса данных и удаления предыдущего пути с поля
function resetData() {
    startCell = null;
    endCell = null;
    cellField.forEach((cell) => {
        cell.visited = false;
        delete cell.previous;
        setColor(getCellElement(cell), '');
    });
    startPlay()
}

