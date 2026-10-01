import { Gameboard } from './gameboard.js';

export class Player {
  constructor(name, type = 'real') {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
  }

  // Real players use this when they click a cell.
  attack(enemyBoard, coord) {
    return enemyBoard.receiveAttack(coord);
  }

  // Computer uses this. `rand` is injectable so tests are deterministic.
  randomAttack(enemyBoard, rand = Math.random) {
    const available = [];
    for (let x = 0; x < enemyBoard.size; x++) {
      for (let y = 0; y < enemyBoard.size; y++) {
        const taken = enemyBoard.attacks.some((c) => c.x === x && c.y === y);
        if (!taken) available.push({ x, y });
      }
    }
    if (available.length === 0) throw new Error('No legal moves left');

    const index = Math.floor(rand() * available.length);
    const coord = available[index];
    enemyBoard.receiveAttack(coord);
    return coord;
  }
}