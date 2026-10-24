// Populate grid
export function renderBoard(gameboardSelector, playerTurn, isInteractive = false) {
    const grid = document.querySelector(gameboardSelector);
    const rowLabels = grid.parentNode.querySelectorAll('.left-labels span');
    const colLabels = grid.parentNode.querySelectorAll('.top-labels span');
    for (let i=0; i<100; i++) {
        // Create cell
        let cell = document.createElement('div');
        cell.classList.add('cell');
        if (gameboardSelector === '#player-board') {
            cell.classList.add('player-cell');
        } else {
            cell.classList.add('opponent-cell');
        };
        cell.dataset.row = Math.floor(i/10);
        cell.dataset.col = i%10;

        // Row/Col label highlight event listener
        cell.addEventListener('mouseenter', (e) => {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;
            if (rowLabels[row]) rowLabels[row].classList.add('active-label');
            if (colLabels[col]) colLabels[col].classList.add('active-label');
        });
        cell.addEventListener('mouseleave', (e) => {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;
            if (rowLabels[row]) rowLabels[row].classList.remove('active-label');
            if (colLabels[col]) colLabels[col].classList.remove('active-label');
        });

        // Click event listener
        if (isInteractive) {
            cell.addEventListener('click', (e) => {
                const row = e.target.dataset.row;
                const col = e.target.dataset.col;
                
                if (playerTurn) {
                    playerTurn(row, col)
                };
            });
            
        };

        // Append to grid
        grid.appendChild(cell);
    };
};

function renderShips(gameboard) {
    const grid = document.querySelector('#player-board');
    if (!grid) return;

    for (let row=0; row<10; row++) {
        for (let col=0; col<10; col++) {
            if (gameboard.grid[row][col].ship !== null) {
                const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.innerText = '';
                    cell.classList.add('ship');
                };
            };
        };
    };
};

export function refreshBoards(playerGameboard, opponentGameboard) {
    const fleetBoard = document.querySelector('#player-board');
    const trackingBoard = document.querySelector('#opponent-board');
    const cells = document.querySelectorAll('.cell');

    // Clear each gameboard
    cells.forEach(cell => {
        cell.classList.remove('miss');
        cell.classList.remove('hit');
        cell.classList.remove('ship');
        cell.replaceChildren();
    });

    // Repaint cells
    renderShips(playerGameboard);
    for (let row=0; row<10; row++) {
        for (let col=0; col<10; col++) {
            if (playerGameboard.grid[row][col].hit) {
                const cell = fleetBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell && playerGameboard.grid[row][col].ship !== null) {
                    cell.classList.add('hit');
                    let explosionIcon = document.createElement('p')
                    explosionIcon.innerText = "💥";
                    cell.appendChild(explosionIcon);
                } else if (cell) {
                    cell.classList.add('miss');
                };
            };
            if (opponentGameboard.grid[row][col].hit) {
                const cell = trackingBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell && opponentGameboard.grid[row][col].ship !== null) {
                    cell.classList.add('hit');
                    let explosionIcon = document.createElement('p')
                    explosionIcon.innerText = "💥";
                    cell.appendChild(explosionIcon);
                } else if (cell) {
                    cell.classList.add('miss');
                };
            };
        };
    };

};




export function renderGameover(winner) {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.replaceChildren();

    const gameoverMessage = document.createElement('p');
    const winnerMessage = document.createElement('p');
    gameoverMessage.textContent = 'GAMEOVER';
    gameoverMessage.classList.add('gameover');
    winnerMessage.textContent = `${winner} wins!`;
   
    gameContainer.appendChild(gameoverMessage);
    gameContainer.appendChild(winnerMessage);
};