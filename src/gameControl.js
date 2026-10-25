import { Player } from './player.js'
import { Ship } from './ship.js'
import { renderBoard, refreshBoards, startButton, resetButton, renderTurn, renderModal, renderGameover } from './DOM.js'

let player1;
let player2;
let gameMode;
let turnControl = 'p1'; // Player 1 = 'p1' , Player 2 = 'p2'
let gamePhase = 'setup' // setup / combat / gameover

function startGame(mode = 'pve') {
    gameMode = mode;
    player1 = new Player('Player 1');
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

async function handlePlayerTurn(row, col) {
    if (gamePhase !== 'combat') return;

    // Determine current attacker & defender
    let attacker = turnControl === 'p1' ? player1 : player2;
    let defender = turnControl === 'p1' ? player2 : player1;

    if (attacker.computer) return;

    // Place attack (if valid) & update gameboards
    const result = attacker.playerAttack(defender.gameboard, [row, col]);
    if (!result) return;
    refreshBoards(attacker.gameboard, defender.gameboard);

    // Check for win condition
    if (defender.gameboard.isShipsSunk()) {
        gamePhase = 'gameover';
        renderGameover(attacker.name);
    };
    
    // Show 'swap device' modal prior to swapping boards
    if (!defender.computer) await renderModal(defender);

    // Switch turns & swap boards
    turnControl = turnControl === 'p1' ? 'p2' : 'p1';
    renderTurn(defender);
    if (!defender.computer) refreshBoards(defender.gameboard, attacker.gameboard); // Only swap boards if in pvp mode
    

    if (turnControl === 'p2' && player2.computer) {
        setTimeout(() => handleComputerTurn(), Math.floor(Math.random()*2500)+1250);
    };
};

function handleComputerTurn() {
    if (gamePhase !== 'combat') return;

    // Place attack (if valid) & render attack onto board
    const result = player2.computerAttack(player1.gameboard);
    if (!result) return;
    
    refreshBoards(player1.gameboard, player2.gameboard);

    // Check for computer win condition
    if (player1.gameboard.isShipsSunk()) {
        gamePhase = 'gameover';
        renderGameover(player2.name);
    };

    // Switch turns
    renderTurn(player1);
    turnControl = 'p1';
};




function initialiseGame(mode) {
    startButton(() => {
        startGame(mode)});
    resetButton(() => {
        startGame(mode)
    });
}
initialiseGame('pve')