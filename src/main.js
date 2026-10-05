import { Player } from './player.js';
import { renderBoard } from './render.js';
import './style.css';

const human = new Player('You', 'real');
const cpu = new Player('HAL', 'computer');

// Predetermined placements for now
const fleet = [
  { length: 5, start: { x: 0, y: 0 }, dir: 'horizontal' },
  { length: 4, start: { x: 0, y: 2 }, dir: 'horizontal' },
  { length: 3, start: { x: 0, y: 4 }, dir: 'horizontal' },
  { length: 3, start: { x: 0, y: 6 }, dir: 'horizontal' },
  { length: 2, start: { x: 0, y: 8 }, dir: 'horizontal' },
];

for (const { length, start, dir } of fleet) {
  human.gameboard.placeShip(length, start, dir);
  cpu.gameboard.placeShip(length, start, dir);
}

const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');

// Game state
let gameOver = false;

function render() {
  renderBoard(playerBoardEl, human.gameboard, { revealShips: true });
  renderBoard(enemyBoardEl, cpu.gameboard, { revealShips: false });
}

function setStatus(text) {
  statusEl.textContent = text;
}

// Turn loop
function handleEnemyClick(event) {
  if (gameOver) return;
  const cell = event.target.closest('.cell');
  if (!cell) return;

  const coord = { x: Number(cell.dataset.x), y: Number(cell.dataset.y) };

  // Real player attacks
  try {
    human.attack(cpu.gameboard, coord);
  } catch {
    return; // already attacked — ignore click
  }
  render();

  if (cpu.gameboard.allSunk()) {
    gameOver = true;
    setStatus('You win! 🎉');
    return;
  }

  // Computer's turn
  setStatus('Enemy is thinking...');
  setTimeout(() => {
    if (gameOver) return;
    cpu.randomAttack(human.gameboard);
    render();

    if (human.gameboard.allSunk()) {
      gameOver = true;
      setStatus('Enemy wins 💀');
      return;
    }

    setStatus('Your turn — click the enemy board.');
  }, 400);
}

enemyBoardEl.addEventListener('click', handleEnemyClick);

// Initial paint
render();
setStatus('Your turn — click the enemy board.');