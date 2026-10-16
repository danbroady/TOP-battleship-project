import { Player } from '../player.js'
import { Ship } from '../ship.js'

test('1.1 - Test constructor', () => {
    let testPlayer1 = new Player('Dan');

    expect(testPlayer1.name).toBe('Dan');
    expect(testPlayer1.computer).toBeFalsy();
    expect(testPlayer1.difficulty).toBe('easy');
    expect(testPlayer1.gameboard).toBeDefined();

    let testPlayer2 = new Player('Computer', true, 'impossible');

    expect(testPlayer2.name).toBe('Computer');
    expect(testPlayer2.computer).toBeTruthy();
    expect(testPlayer2.difficulty).toBe('impossible');
    expect(testPlayer2.gameboard).toBeDefined();
});

test('2.1 - Test computerAttack, easy mode', () => {
    let testPlayer1 = new Player('Computer', true, 'impossible');
    let testPlayer2 = new Player('Dan');
    let enemyBoard = testPlayer2.gameboard;

    // expect(testPlayer1.computerAttack(enemyBoard)).toBe('Computer missed!')
    expect(testPlayer1.computerAttack(enemyBoard)).toBe('miss')
});

test('2.2 - Test computerAttack, impossible mode', () => {
    let testPlayer1 = new Player('Computer', true, 'impossible');
    let testPlayer2 = new Player('Dan');
    let testShip = new Ship(2);
    let enemyBoard = testPlayer2.gameboard;

    enemyBoard.placeShip(testShip, [[4,4],[5,4]]);

    // expect(testPlayer1.computerAttack(enemyBoard)).toBe('Computer fired at [4,4] and hit!')
    // expect(testPlayer1.computerAttack(enemyBoard)).toBe('Computer fired at [5,4] and hit!')
    expect(testPlayer1.computerAttack(enemyBoard)).toBe('miss')
    expect(testPlayer1.computerAttack(enemyBoard)).toBe('hit')
});

test('3.1 - Test playerAttack', () => {
    let testPlayer1 = new Player('Player1');
    let testPlayer2 = new Player('Player2');
    let testShip = new Ship(2);
    let enemyBoard = testPlayer2.gameboard;

    enemyBoard.placeShip(testShip, [[4,4],[5,4]]);

    expect(testPlayer1.playerAttack(enemyBoard,[-1,2])).toBeFalsy()
    expect(testPlayer1.playerAttack(enemyBoard,[10,11])).toBeFalsy()
    // expect(testPlayer1.playerAttack(enemyBoard,[4,4])).toBe('Player1 fired at [4,4] and hit!')
    // expect(testPlayer1.playerAttack(enemyBoard,[5,5])).toBe('Player1 missed!')
    expect(testPlayer1.playerAttack(enemyBoard,[4,4])).toBe('hit')
    expect(testPlayer1.playerAttack(enemyBoard,[5,5])).toBe('miss')
});