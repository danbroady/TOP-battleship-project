import { Gameboard } from '../gameboard.js'
import { Ship } from '../ship.js'

test('1.1 - Test constructor',() => {
    let testBoard = new Gameboard();
    expect(testBoard.grid.length).toEqual(10);
    expect(testBoard.grid[0].length).toEqual(10);
    expect(testBoard.grid[9].length).toEqual(10);
    expect(testBoard.grid[0][0]).toBeInstanceOf(Object);
    expect(testBoard.grid[9][9].ship).toBeNull();
    expect(testBoard.grid[9][9].hit).toBeFalsy();
});

test('2.1 - Test placeShip, successful placement', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    testBoard.placeShip(testShip, [[0,0],[0,1]]);

    expect(testBoard.grid[0][0].ship).toBe(testShip);
    expect(testBoard.grid[0][1].ship).toBe(testShip);
    expect(testBoard.grid[0][2].ship).toBeNull();
});

test('2.2 - Test placeShip, overlapping placement', () => {
    let testBoard = new Gameboard();
    let testShip1 = new Ship(2);

    testBoard.placeShip(testShip1, [[0,0],[0,1]]);

    let testShip2 = new Ship(2);

    expect(testBoard.placeShip(testShip2, [[0,0],[0,1]])).toBeFalsy;
    expect(testBoard.grid[0][0].ship).toBe(testShip1);
    expect(testBoard.grid[0][1].ship).toBe(testShip1);

    expect(testBoard.placeShip(testShip2, [[0,1],[0,2]])).toBeFalsy;
    expect(testBoard.grid[0][0].ship).toBe(testShip1);
    expect(testBoard.grid[0][1].ship).toBe(testShip1);
    expect(testBoard.grid[0][2].ship).not.toBe(testShip2);
});


test('2.3 - Test placeShip, out of bounds placement', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    testBoard.placeShip(testShip, [[0,0],[0,1]]);

    expect(testBoard.placeShip(testShip, [[10,10],[10,11]])).toBeFalsy(); // Full out of bounds
    expect(testBoard.placeShip(testShip, [[9,9],[9,10]])).toBeFalsy(); // Part out of bounds
});

test('2.4 - Test placeShip, diagonal placement', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    expect(testBoard.placeShip(testShip, [[0,0],[1,1]])).toBeFalsy();
});


test('2.5 - Test placeShip, ships property', () => {
    let testBoard = new Gameboard();
    let testShip1 = new Ship(2);
    let testShip2 = new Ship(3);

    testBoard.placeShip(testShip1, [[0,0],[0,1]]);
    testBoard.placeShip(testShip2, [[2,2],[3,2],[4,2]]);

    expect(testBoard.ships[0].length).toEqual(2);
    expect(testBoard.ships[1].length).toEqual(3);
});

test('3.1 - Test receiveAttack, successful hit', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    testBoard.placeShip(testShip, [[0,0],[0,1]]);

    expect(testBoard.receiveAttack([0,0])).toBe('hit');
    expect(testBoard.grid[0][0].hit).toBeTruthy();
    expect(testBoard.grid[0][1].hit).toBeFalsy();
});

test('3.2 - Test receiveAttack, out of bounds hit', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    testBoard.placeShip(testShip, [[0,0],[0,1]]);

    expect(testBoard.receiveAttack([0,-1])).toBeFalsy();
    expect(testBoard.receiveAttack([10,10])).toBeFalsy();
    expect(testBoard.grid[0][0].hit).toBeFalsy();
});

test('3.3 - Test receiveAttack, repeated hit', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    testBoard.placeShip(testShip, [[0,0],[0,1]]);
    testBoard.receiveAttack([0,0]);

    expect(testBoard.receiveAttack([0,0])).toBeFalsy();
    expect(testBoard.receiveAttack([0,1])).toBeTruthy();
});

test('3.4 - Test receiveAttack, missed hit', () => {
    let testBoard = new Gameboard();
    let testShip = new Ship(2);

    testBoard.placeShip(testShip, [[0,0],[0,1]]);

    expect(testBoard.receiveAttack([0,2])).toBe('miss');
    expect(testBoard.grid[0][2].hit).toBeTruthy();
});

test('4.1 - Test isShipsSunk', () => {
    let testBoard = new Gameboard();
    let testShip1 = new Ship(2);
    let testShip2 = new Ship(3);
    testBoard.placeShip(testShip1, [[0,0],[0,1]]);
    testBoard.placeShip(testShip2, [[7,7],[8,7],[9,7]]);

    expect(testBoard.isShipsSunk()).toBeFalsy();

    testBoard.receiveAttack([0,0]);
    testBoard.receiveAttack([0,1]);
    testBoard.receiveAttack([7,7]);
    testBoard.receiveAttack([8,7]);
    
    expect(testBoard.isShipsSunk()).toBeFalsy();

    testBoard.receiveAttack([9,7]);

    expect(testBoard.isShipsSunk()).toBeTruthy();
});