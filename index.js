const grid = document.querySelector('.grid');
const overlay = document.querySelector('.overlay');
const startCell = null;
const endCell = null;
const btnBuild = document.querySelector('.btn__build');
const arrow = document.querySelector('.arrow');

function fillTheCeilField() {
    for(let i = 0; i < 100; i++) {
        for(let j = 0; j < 100; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
        }
    }
    findStartAndEndElement();
}
fillTheCeilField();

function findStartAndEndElement() {
    let clickCount = 0;

    grid.addEventListener('click', (event) => {
        clickCount++;

        const { target } = event;
        if (clickCount === 1) {
            const startCell = target;
            console.log(target);
            target.style.backgroundColor = "green";
        } else if (clickCount === 2) {
            const endCell = target;
            console.log(target);
            target.style.backgroundColor = "red";
            arrow.classList.add('active');
        }

        if (clickCount > 2) {
            target.removeEventListener("click");
            console.log(target);
        }
    })
}


function startPlay() {
    const btnPlay = document.querySelector('.btn__play');

    btnPlay.addEventListener('click', () => {
        console.log('a')
        overlay.style.display = 'none';
    })
}
