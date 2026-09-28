import { Ship } from './ship.js';

describe('Ship', () => {
  test('has the length it was created with', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
  });

  test('starts with zero hits', () => {
    const ship = new Ship(3);
    expect(ship.hits).toBe(0);
  });

  test('hit() increases the number of hits', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test('isSunk() is false before enough hits', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test('isSunk() is true once hits equal length', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('isSunk() stays true after extra hits', () => {
    const ship = new Ship(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});