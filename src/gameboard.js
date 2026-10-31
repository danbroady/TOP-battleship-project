export class Gameboard {
    constructor() {
        this.grid = [];
        this.ships = [];

        for (let row=0; row<10; row++) {
            let currentRow = [];
            for (let col=0; col<10; col++) {
                currentRow.push({ship:null, hit:false});
            };
            this.grid.push(currentRow);
        };
    };
    
    placeShip(ship, coordsArray) {
        // Validation
        if (!this.checkShipPlacement(ship, coordsArray)) return false;

        // Place ship if valid
        coordsArray.forEach((coord) => {
            this.grid[coord[0]][coord[1]].ship = ship;
        });
        this.ships.push(ship);
        return true;
    };
    // Extra function added to split out checking ship validity & placing the ship (beneficial for DOM.js/gameControl.js's ship preview during setup)
    checkShipPlacement(ship, coordsArray) {
        // Validation
        for (let coord of coordsArray) {
            // - out of bounds placement
            if (!this._validateCoords(coord)) {
                return false;
            //  - overlapping placement
            } else if (this.grid[coord[0]][coord[1]].ship !== null) {
                return false;
            };
        };
        // - diagonal placement
        if (coordsArray[0][0] !== coordsArray[1][0] && coordsArray[0][1] !== coordsArray[1][1]) {
                return false;
        };

        // Otherwise, valid
        return true;
    };


    receiveAttack(coord) {
        // Validation
        // - out of bounds attack
        if (!this._validateCoords(coord)) {
            return false;
        // - repeat attack
        } else if (this.grid[coord[0]][coord[1]].hit === true) {
            return false;
        };

        // Valid, unique attack, register hit in cell
        this.grid[coord[0]][coord[1]].hit = true;

        // Check cell for ship
        if (this.grid[coord[0]][coord[1]].ship !== null) {
            this.grid[coord[0]][coord[1]].ship.hit();
            return 'hit';
        };

        // Otherwise, missed attack
        return 'miss';
    };

    _validateCoords(coord) {
        if (coord[0]<0 || coord[0]>9 || coord[1]<0 || coord[1]>9) {
                return false;
        };
        return true;
    };

    isShipsSunk() {
        if (this.ships.every((ship) => ship.isSunk())) return true;
        return false;
    };
};