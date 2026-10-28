import { Player } from './player.js'
import { Ship } from './ship.js'
import { renderBoard, renderDeployment, refreshBoards, startButton, resetButton, renderTurn, renderModal, renderGameover, modeButton, orientation, enableStartButton } from './DOM.js'

let player1;
let player2;
let gameMode;
let turnControl = 'p1'; // Player 1 = 'p1' , Player 2 = 'p2'
let gamePhase = 'setup' // setup / combat / gameover

const fleet = [
    { name: 'carrier', length: 5 },
    { name: 'battleship', length: 4 },
    { name: 'destroyer', length: 3 },
    { name: 'submarine', length: 3 },
    { name: 'patrol boat', length: 2 }
];
let p1ShipCounter = 0;
let p2ShipCounter = 0;
let currentSetupPlayer = 'p1'
let currentOrientation = 'VERTICAL';

function startGame(mode = 'PvE') {
    gameMode = mode;
    gamePhase = 'combat';

    renderBoard('#player-board', null, false);
    renderBoard('#opponent-board', handlePlayerTurn, true);
    refreshBoards(player1.gameboard, player2.gameboard);

    // player1 = new Player('Player 1');
    // if (gameMode === 'PvE') {
    //     player2 = new Player('Computer', true, 'easy');
    // } else {
    //     player2 = new Player('Player 2');
    // };
};

function handleSetup(row, col) {
    if (gamePhase !== 'setup') return;

    const currentFleet = fleet;
    let shipCounter = currentSetupPlayer === 'p1' ? p1ShipCounter : p2ShipCounter;
    const activePlayer = currentSetupPlayer === 'p1' ? player1 : player2;
    const opponentBoard = currentSetupPlayer === 'p1' ? player2.gameboard : player1.gameboard;

    // Check if ships have been placed
    if (shipCounter >= currentFleet.length) return;

    const currentShip = currentFleet[shipCounter];

    // Generate coords based on orientation
    const coords = [];
    for (let i=0; i < currentShip.length; i++) {
        let r = parseInt(row);
        let c = parseInt(col);
        if (currentOrientation === 'VERTICAL') {
            r += i;
        } else {
            c += i;
        };
        coords.push([r,c]);
    };

    // Create ship object & attempt placement
    const newShip = new Ship(currentShip.length);
    const success = activePlayer.gameboard.placeShip(newShip, coords);
    
    if (success) {
        // Increment index & refresh board view for new ship
        if (currentSetupPlayer === 'p1') {
            p1ShipCounter++;
            shipCounter = p1ShipCounter;
        } else {
            p2ShipIndex++;
            shipCounter = p2ShipCounter;
        };
        refreshBoards(activePlayer.gameboard, opponentBoard);

        if (shipCounter >= currentFleet.length) {
            handleNextSetup();
        };
    } else {
        console.log("Invalid placement");
    };
};
async function handleNextSetup() {
    if (gameMode === 'PvE' || currentSetupPlayer === 'p2') {
        // If PvE or player2 has finished, automatically deploy computer ships (PvE) or enable start button (PvP)
        if (gameMode === 'PvE') {
            computerDeploy(player2);
        };
        gamePhase = 'combat';
        enableStartButton();
    } else {
        //  PvP mode: player1 has finished, prompt to pass to player2
        currentSetupPlayer = 'p2';
        document.querySelector('#player-board').replaceChildren();
        await renderModal(player2);
        refreshBoards(player2.gameboard, player1.gameboard);
    };
};
function computerDeploy(player) {
    fleet.forEach(ship => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random()*10);
            const col = Math.floor(Math.random()*10);
            const vertical = Math.random() < 0.5;
            const coords = [];
            for (let i=0; i < ship.length; i++){
                coords.push([vertical ? row+i : row, vertical ? col : col+i]);
            };
            const shipObj = new Ship(ship.length);
            placed = player.gameboard.placeShip(shipObj, coords);
        };
    });
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
        renderGameover(attacker);
        return;
    };
    
    // Show 'swap device' modal prior to swapping boards
    if (!defender.computer) await renderModal(defender);

    // Switch turns & swap boards
    turnControl = turnControl === 'p1' ? 'p2' : 'p1';
    renderTurn(defender);
    if (!defender.computer) refreshBoards(defender.gameboard, attacker.gameboard); // Only swap boards if in pvp mode

    if (turnControl === 'p2' && player2.computer) {
        setTimeout(() => handleComputerTurn(), Math.floor(Math.random()*2500)+1000);
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
        renderGameover(player2);
        return;
    };

    // Switch turns
    renderTurn(player1);
    turnControl = 'p1';
};




function initialiseGame() {
    gamePhase = 'setup';
    currentSetupPlayer = 'p1';
    p1ShipCounter = 0;
    p2ShipCounter = 0;

    player1 = new Player('Player 1');
    const modeBtn = document.querySelector('#header-mode');
    gameMode = modeBtn ? modeBtn.querySelector('span').innerText : 'PvE';
    if (gameMode === 'PvE') {
        player2 = new Player('Computer', true, 'easy');
    } else {
        player2 = new Player('Player 2');
    }

    renderBoard('#player-board', handleSetup, true);
    renderBoard('#opponent-board', null, false);

    modeButton();
    orientation(gamePhase);

    startButton(() => {
        // const modeBtn = document.querySelector('#header-mode');
        // gameMode = modeBtn.querySelector('span').innerText;
        startGame(gameMode)});
    resetButton(() => {
        initialiseGame();
    });
    
}
initialiseGame();