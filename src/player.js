import { Gameboard } from './gameboard'

export class Player {
    constructor (name, computer=false, difficulty='easy') {
        this.name = name;
        this.computer = computer;
        this.difficulty = difficulty;
        this.gameboard = new Gameboard();
        this.attacks = [];
    };

    playerAttack(enemyBoard, attackCoords) {
        let attackOutcome = enemyBoard.receiveAttack(attackCoords);

        // Invalid attack
        if (!attackOutcome) {
            return false;
        };

        // Valid attack
        this.attacks.push(attackCoords);
        if (attackOutcome === 'hit') {
            return `${this.name} fired at [${attackCoords}] and hit!`;
        };
        return `${this.name} missed!`;
    };

    computerAttack(enemyBoard) {
        let attackCoords;
        let attackOutcome;

        if (this.difficulty === 'easy') {
            // Easy mode
            do {
                let row = Math.floor(Math.random() * 10);
                let col  = Math.floor(Math.random() * 10);
                attackCoords = [row, col];
                attackOutcome = enemyBoard.receiveAttack(attackCoords);
            } while (attackOutcome === false);

        } else {
            // Impossible mode
            for (let row=0; row<10; row++) {
                let found = false;
                for (let col=0; col<10; col++) {
                    if (enemyBoard.grid[row][col].ship !== null && enemyBoard.grid[row][col].hit === false) {
                        attackCoords = [row, col];
                        attackOutcome = enemyBoard.receiveAttack(attackCoords);
                        found = true;
                        break;
                    };
                };
                if (found) break;
            };
        };

        // Add coords to hit list & return attack string
        this.attacks.push(attackCoords);
        if (attackOutcome === 'hit') {
            return `${this.name} fired at [${attackCoords}] and hit!`;
        };
        return `${this.name} missed!`;
    };
};