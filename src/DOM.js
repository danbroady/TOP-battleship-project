

// Populate grid
export function renderBoard(gameboardSelector, playerTurn, isInteractive = false) {
    const grid = document.querySelector(gameboardSelector);
    for (let i=0; i<100; i++) {
        // Create cell
        let cell = document.createElement('div');
        cell.dataset.row = Math.floor(i/10);
        cell.dataset.col = i%10;
        cell.innerText = `[${cell.dataset.row},${cell.dataset.col}]`;

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

export function updateCell(gameboardSelector, row, col, result) {
    console.log(result);
    const grid = document.querySelector(gameboardSelector);
    if (!grid) return;

    const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;

    if (result === 'hit') {
        cell.style.backgroundColor = 'green';
        cell.innerText = '';
    } else if (result === 'miss') {
        cell.style.backgroundColor = 'red';
        cell.innerText = '';
    };
};