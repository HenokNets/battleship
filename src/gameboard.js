import { Ship } from './ship.js';

export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];           // { ship, coordinates: [{x,y}, ...] }
    this.missedAttacks = [];   // [{x,y}, ...]
    this.attacks = [];         // every coordinate ever attacked
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

  receiveAttack({ x, y }) {
    const alreadyAttacked = this.attacks.some(
      (c) => c.x === x && c.y === y
    );
    if (alreadyAttacked) throw new Error('Coordinate already attacked');

    this.attacks.push({ x, y });

    const target = this.ships.find((placed) =>
      placed.coordinates.some((c) => c.x === x && c.y === y)
    );

    if (target) {
      target.ship.hit();
      return 'hit';
    }

    this.missedAttacks.push({ x, y });
    return 'miss';
  }

  allSunk() {
    if (this.ships.length === 0) return false;
    return this.ships.every((placed) => placed.ship.isSunk());
  }

  placeShipRandomly(length, rand = Math.random) {
    const maxAttempts = 200;
    for (let i = 0; i < maxAttempts; i++) {
      const direction = rand() < 0.5 ? 'horizontal' : 'vertical';
      const maxX = direction === 'horizontal' ? this.size - length : this.size - 1;
      const maxY = direction === 'vertical' ? this.size - length : this.size - 1;
      const x = Math.floor(rand() * (maxX + 1));
      const y = Math.floor(rand() * (maxY + 1));
      try {
        return this.placeShip(length, { x, y }, direction);
      } catch {
        // overlap or out of bounds — try again
      }
    }
    throw new Error('Could not place ship after max attempts');
  }
}