const HIT_CLASS = 'hit';
const MISS_CLASS = 'miss';
const SHIP_CLASS = 'ship';

export function renderBoard(container, gameboard, { revealShips = false } = {}) {
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${gameboard.size}, 32px)`;
  container.style.gridTemplateRows = `repeat(${gameboard.size}, 32px)`;

  for (let y = 0; y < gameboard.size; y++) {
    for (let x = 0; x < gameboard.size; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;

      const attacked = gameboard.attacks.some((c) => c.x === x && c.y === y);
      const shipHere = gameboard.ships.find((s) =>
        s.coordinates.some((c) => c.x === x && c.y === y)
      );

      if (attacked && shipHere) {
        cell.classList.add(shipHere.ship.isSunk() ? 'sunk' : HIT_CLASS);
      } else if (attacked) {
        cell.classList.add(MISS_CLASS);
      } else if (revealShips && shipHere) {
        cell.classList.add(SHIP_CLASS);
      }

      container.appendChild(cell);
    }
  }
}