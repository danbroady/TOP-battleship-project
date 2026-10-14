import { Ship } from '../ship.js'


test('1 - Test constructor', () => {
    let testShip = new Ship(4);
    expect(testShip.length).toEqual(4);
});

test('2 - Test hit method', () => {
    let testShip = new Ship(4);
    testShip.hit();
    expect(testShip.hits).toEqual(1);
    testShip.hit();
    testShip.hit();
    testShip.hit();
    expect(testShip.hits).toEqual(4);
    expect(testShip.hit()).toBeFalsy();
    expect(testShip.hits).toEqual(4);
});

test('3 - Test isSunk method', () => {
    let testShip = new Ship(4);
    expect(testShip.isSunk()).toBeFalsy();
    testShip.hit();
    testShip.hit();
    testShip.hit();
    testShip.hit();
    expect(testShip.isSunk()).toBeTruthy();
});
