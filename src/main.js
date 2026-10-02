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

function render() {
  renderBoard(playerBoardEl, human.gameboard, { revealShips: true });
  renderBoard(enemyBoardEl, cpu.gameboard, { revealShips: false });
}

render();