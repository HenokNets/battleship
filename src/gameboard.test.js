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