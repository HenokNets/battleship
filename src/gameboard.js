import { Ship } from './ship.js';

export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];           // { ship, coordinates: [{x,y}, ...] }
    this.missedAttacks = [];   // will be filled later..
  }

  placeShip(length, start, direction = 'horizontal') {
    const coordinates = [];
    for (let i = 0; i < length; i++) {
      const x = direction === 'horizontal' ? start.x + i : start.x;
      const y = direction === 'vertical' ? start.y + i : start.y;
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
        throw new Error('Ship placement out of bounds');
      }
      coordinates.push({ x, y });
    }

    const overlaps = coordinates.some((coord) =>
      this.ships.some((placed) =>
        placed.coordinates.some((c) => c.x === coord.x && c.y === coord.y)
      )
    );
    if (overlaps) throw new Error('Ship placement overlaps existing ship');

    const ship = new Ship(length);
    this.ships.push({ ship, coordinates });
    return ship;
  }
}