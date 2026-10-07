import { Player } from './player.js';
import { renderBoard } from './render.js';
import './style.css';

const human = new Player('You', 'real');
const cpu = new Player('HAL', 'computer');

// Fleet definition — used for both players
const FLEET = [5, 4, 3, 3, 2];

const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');
const controlsEl = document.getElementById('controls');
const shuffleBtn = document.getElementById('shuffle');
const startBtn = document.getElementById('start');

// Game state
let phase = 'placement'; // 'placement' | 'playing' | 'over'

function render() {
  renderBoard(playerBoardEl, human.gameboard, { revealShips: true });
  renderBoard(enemyBoardEl, cpu.gameboard, { revealShips: false });
}

function setStatus(text) {
  statusEl.textContent = text;
}

// Placement phase
function placeHumanFleetRandomly() {
  human.gameboard = new (human.gameboard.constructor)();
  for (const length of FLEET) {
    human.gameboard.placeShipRandomly(length);
  }
}

function beginPlacement() {
  phase = 'placement';
  placeHumanFleetRandomly();
  render();
  setStatus('Place your ships — shuffle or start when ready.');
  controlsEl.classList.remove('hidden');
  shuffleBtn.disabled = false;
  startBtn.disabled = false;
}

// Playing phase
function beginGame() {
  phase = 'playing';
  controlsEl.classList.add('hidden');

  for (const length of FLEET) {
    cpu.gameboard.placeShipRandomly(length);
  }

  render();
  setStatus('Your turn — click the enemy board.');
}

function endGame(winner) {
  phase = 'over';
  setStatus(winner === 'human' ? 'You win! 🎉' : 'Enemy wins 💀');
}

// Turn loop
function handleEnemyClick(event) {
  if (phase !== 'playing') return;
  const cell = event.target.closest('.cell');
  if (!cell) return;

  const coord = { x: Number(cell.dataset.x), y: Number(cell.dataset.y) };

  // Real player attacks
  try {
    human.attack(cpu.gameboard, coord);
  } catch {
    return; // already attacked? ignore click
  }
  render();

  if (cpu.gameboard.allSunk()) {
    endGame('human');
    return;
  }

  // Computer's turn
  setStatus('Enemy is thinking...');
  setTimeout(() => {
    if (phase !== 'playing') return;
    cpu.randomAttack(human.gameboard);
    render();

    if (human.gameboard.allSunk()) {
      endGame('cpu');
      return;
    }

    setStatus('Your turn — click the enemy board.');
  }, 400);
}

// Wire buttons
shuffleBtn.addEventListener('click', () => {
  if (phase !== 'placement') return;
  placeHumanFleetRandomly();
  render();
  setStatus('Place your ships — shuffle or start when ready.');
});

startBtn.addEventListener('click', beginGame);

enemyBoardEl.addEventListener('click', handleEnemyClick);

// Initial paint
beginPlacement();