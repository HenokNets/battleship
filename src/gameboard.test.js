import { Gameboard } from './gameboard.js';

describe('Gameboard', () => {
  test('creates a board of default size 10x10', () => {
    const board = new Gameboard();
    expect(board.size).toBe(10);
  });

  test('places a horizontal ship at given coordinates', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 0, y: 0 }, 'horizontal');
    expect(board.ships.length).toBe(1);
    const placed = board.ships[0];
    expect(placed.ship.length).toBe(3);
    expect(placed.coordinates).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]);
  });

  test('places a vertical ship at given coordinates', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 4, y: 2 }, 'vertical');
    const placed = board.ships[0];
    expect(placed.coordinates).toEqual([
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
    ]);
  });

  test('throws if ship goes out of bounds horizontally', () => {
    const board = new Gameboard();
    expect(() => board.placeShip(3, { x: 8, y: 0 }, 'horizontal')).toThrow();
  });

  test('throws if ship goes out of bounds vertically', () => {
    const board = new Gameboard();
    expect(() => board.placeShip(3, { x: 0, y: 8 }, 'vertical')).toThrow();
  });

  test('throws if ship overlaps an existing ship', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 0, y: 0 }, 'horizontal');
    expect(() => board.placeShip(3, { x: 1, y: 0 }, 'horizontal')).toThrow();
  });
});

describe('Gameboard attacks', () => {
  test('receiveAttack returns "hit" when it lands on a ship', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 0, y: 0 }, 'horizontal');
    const result = board.receiveAttack({ x: 1, y: 0 });
    expect(result).toBe('hit');
  });

  test('receiveAttack increases the hit ship\'s hit count', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 0, y: 0 }, 'horizontal');
    board.receiveAttack({ x: 1, y: 0 });
    expect(board.ships[0].ship.hits).toBe(1);
  });

  test('receiveAttack returns "miss" when it lands on water', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 0, y: 0 }, 'horizontal');
    const result = board.receiveAttack({ x: 5, y: 5 });
    expect(result).toBe('miss');
  });

  test('records missed attacks', () => {
    const board = new Gameboard();
    board.receiveAttack({ x: 5, y: 5 });
    board.receiveAttack({ x: 6, y: 5 });
    expect(board.missedAttacks).toEqual([
      { x: 5, y: 5 },
      { x: 6, y: 5 },
    ]);
  });

  test('throws if the same coordinate is attacked twice', () => {
    const board = new Gameboard();
    board.receiveAttack({ x: 5, y: 5 });
    expect(() => board.receiveAttack({ x: 5, y: 5 })).toThrow();
  });

  test('throws if attacking the same ship square twice', () => {
    const board = new Gameboard();
    board.placeShip(3, { x: 0, y: 0 }, 'horizontal');
    board.receiveAttack({ x: 0, y: 0 });
    expect(() => board.receiveAttack({ x: 0, y: 0 })).toThrow();
  });

  test('allSunk() is false while any ship is afloat', () => {
    const board = new Gameboard();
    board.placeShip(2, { x: 0, y: 0 }, 'horizontal');
    board.receiveAttack({ x: 0, y: 0 });
    expect(board.allSunk()).toBe(false);
  });

  test('allSunk() is true when every ship is sunk', () => {
    const board = new Gameboard();
    board.placeShip(2, { x: 0, y: 0 }, 'horizontal');
    board.placeShip(1, { x: 5, y: 5 }, 'horizontal');
    board.receiveAttack({ x: 0, y: 0 });
    board.receiveAttack({ x: 1, y: 0 });
    board.receiveAttack({ x: 5, y: 5 });
    expect(board.allSunk()).toBe(true);
  });

  test('allSunk() is false on an empty board with no ships placed', () => {
    const board = new Gameboard();
    expect(board.allSunk()).toBe(false);
  });
});