


// Initialise game environment
// - Fleet configuration (Carrier:5, Battleship:4, Destroyer:3, Submarine:3, Patrol boat:2)
// - Player ship placement phase
// - Computer ship placement phase

// Turn-based loop
// - Turn switching, pointer for who's turn

// Error/State handling
// - Handling false returns for playerAttack()
// - Check win condition every hit


import { Player } from './player.js'
import { Ship } from './ship.js'
import { renderBoard, refreshBoards, renderGameover } from './DOM.js'

let player1;
let player2;
let gameMode;
let turnControl = 'p1'; // Player 1 = 'p1' , Player 2 = 'p2'
let gamePhase = 'setup' // setup / combat / gameover

function startGame(mode = 'pve') {
    gameMode = mode;
    player1 = new Player('Dan');
    if (gameMode === 'pve') {
        player2 = new Player('Computer', true, 'easy');
    } else {
        player2 = new Player('Player 2');
    };
    
    renderBoard('#player-board', null, false);
    renderBoard('#opponent-board', handlePlayerTurn, true);

    // Populate board
    let carrier1 = new Ship(5)
    player1.gameboard.placeShip(carrier1, [[0,0],[0,1],[0,2],[0,3],[0,4]]);
    let patrol1 = new Ship(2)
    player1.gameboard.placeShip(patrol1, [[5,5],[6,5]]);

    let carrier2 = new Ship(5)
    player2.gameboard.placeShip(carrier2, [[4,3],[5,3],[6,3],[7,3],[8,3]]);
    let patrol2 = new Ship(2)
    player2.gameboard.placeShip(patrol2, [[7,8],[8,8]]);

    gamePhase = 'combat';    
    refreshBoards(player1.gameboard, player2.gameboard);
};
startGame('pvp');

function handlePlayerTurn(row, col) {
    if (gamePhase !== 'combat') return;

    // Determine current attacker & defender
    let attacker = turnControl === 'p1' ? player1 : player2;
    let defender = turnControl === 'p1' ? player2 : player1;

    if (attacker.computer) return;

    const result = attacker.playerAttack(defender.gameboard, [row, col]);

    if (!result) return;

    // console.log(`${attacker.name} aimed at [${row},${col}] with result: ${result}`);
    // updateCell('#opponent-board', row, col, result);
    refreshBoards(attacker.gameboard, defender.gameboard);
    
    // Check for win condition
    if (defender.gameboard.isShipsSunk()) {
        gamePhase = 'gameover';
        renderGameover(attacker.name);
    }

    // Switch turns
    turnControl = turnControl === 'p1' ? 'p2' : 'p1';
    refreshBoards(defender.gameboard, attacker.gameboard);

    if (turnControl === 'p2' && player2.computer) {
        setTimeout(handleComputerTurn(), 500);
    };
};

function handleComputerTurn() {
    if (gamePhase !== 'combat') return;

    const result = player2.computerAttack(player1.gameboard);
    if (!result) return;
    
    let lastAttack = player2.attacks[player2.attacks.length -1];
    let [row,col] = lastAttack;

    // console.log(`Computer aimed at [${row},${col}] with result: ${result}`);
    // updateCell('#player-board', row, col, result);
    refreshBoards(player1.gameboard, player2.gameboard);

    if (player1.gameboard.isShipsSunk()) {
        gamePhase = 'gameover';
        renderGameover(player2.name);
    };

    turnControl = 'p1';
};