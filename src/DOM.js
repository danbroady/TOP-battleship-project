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

export function startButton(callback) {
    const startBtn = document.querySelector('#start-btn');
    const setupCard = document.querySelector('.deployment-card');
    setupCard.style.setProperty('display','flex');
    
    startBtn.addEventListener('click', () => {
        // Set gameplay styling
        const boards = document.querySelectorAll('.grid');
        boards.forEach(grid => grid.replaceChildren());

        const headerComplications = document.querySelector('.header-complications');
        headerComplications.style.setProperty('display','flex');

        setupCard.style.setProperty('display','none');

        // Run startGame() in gameControl.js
        callback();
    });
};
export function resetButton(callback) {
    const resetBtn = document.querySelector('#header-reset');
    resetBtn.addEventListener('click', () => {

        // Set gameplay styling
        const boards = document.querySelectorAll('.grid');
        boards.forEach(grid => grid.replaceChildren());

        const headerComplications = document.querySelector('.header-complications');
        headerComplications.style.setProperty('display','none');

        const setupCard = document.querySelector('.deployment-card');
        setupCard.style.setProperty('display','flex');

        // Run startGame() in gameControl.js
        callback;
    });
};



export function renderTurn(player) {
    const turnContainer = document.querySelector('.header-turn');
    const turnElem = turnContainer.querySelector('p');
    const turnSVG = turnContainer.querySelector('svg');
    
    turnElem.innerText = `${player.name}'s TURN`

    if (player.computer) {
        turnSVG.innerHTML = `<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 2a1 1 0 0 1 2 0v2.062A8.004 8.004 0 0 1 19.938 11H22a1 1 0 0 1 0 2h-2.062A8.004 8.004 0 0 1 13 19.938V22a1 1 0 0 1-2 0v-2.062A8.004 8.004 0 0 1 4.062 13H2a1 1 0 0 1 0-2h2.062A8.004 8.004 0 0 1 11 4.062V2zm7 10a6 6 0 1 0-12 0 6 6 0 0 0 12 0zm-3 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="#f43f5e"></path></g>`;
    } else {
        turnSVG.innerHTML = `<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 22c-1.148 0-3.418-1.362-5.13-3.34C4.44 15.854 3 11.967 3 7a1 1 0 0 1 .629-.929c3.274-1.31 5.88-2.613 7.816-3.903a1 1 0 0 1 1.11 0c1.935 1.29 4.543 2.594 7.816 3.903A1 1 0 0 1 21 7c0 4.968-1.44 8.855-3.87 11.66C15.419 20.637 13.149 22 12 22z" fill="#38bdf8"></path></g>`;
    };

};

export function renderModal(player) {
    return new Promise((resolve) => {
        const turnModal = document.querySelector('#turn-modal');
        const modalText = turnModal.querySelector('#player-name');
        const modalBtn = turnModal.querySelector('button');

        // Show modal
        turnModal.classList.remove('hidden');
        
        // Update player name in modal instructions
        modalText.innerText = player.name;

        // Enable button to hide modal once device has moved
        const handleConfirm = () => {
            turnModal.classList.add('hidden'); // Hide modal
            modalBtn.removeEventListener('click', handleConfirm); // Clean up event listener
            resolve();
        };
        modalBtn.addEventListener('click', handleConfirm);
    });
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