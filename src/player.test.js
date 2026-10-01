import { Player } from './player.js';

describe('Player', () => {
  test('has a name', () => {
    const p = new Player('Alice');
    expect(p.name).toBe('Alice');
  });

  test('is a real player by default', () => {
    const p = new Player('Alice');
    expect(p.type).toBe('real');
  });

  test('can be created as a computer player', () => {
    const p = new Player('HAL', 'computer');
    expect(p.type).toBe('computer');
  });

  test('has its own gameboard', () => {
    const p = new Player('Alice');
    expect(p.gameboard).toBeDefined();
    expect(p.gameboard.size).toBe(10);
  });

  test('two players have separate gameboards', () => {
    const a = new Player('Alice');
    const b = new Player('Bob');
    a.gameboard.placeShip(2, { x: 0, y: 0 }, 'horizontal');
    expect(b.gameboard.ships.length).toBe(0);
  });

  test('attack() forwards to the enemy gameboard', () => {
    const a = new Player('Alice');
    const b = new Player('Bob');
    b.gameboard.placeShip(2, { x: 0, y: 0 }, 'horizontal');
    const result = a.attack(b.gameboard, { x: 0, y: 0 });
    expect(result).toBe('hit');
  });
});

describe('Player — computer', () => {
  test('randomAttack() returns a coordinate', () => {
    const cpu = new Player('HAL', 'computer');
    const enemy = new Player('Alice');
    const coord = cpu.randomAttack(enemy.gameboard, () => 0);
    expect(coord).toEqual({ x: 0, y: 0 });
  });

  test('randomAttack() records the attack on the enemy board', () => {
    const cpu = new Player('HAL', 'computer');
    const enemy = new Player('Alice');
    cpu.randomAttack(enemy.gameboard, () => 0);
    expect(enemy.gameboard.attacks.length).toBe(1);
  });

  test('randomAttack() never repeats a coordinate', () => {
    const cpu = new Player('HAL', 'computer');
    const enemy = new Player('Alice');
    // attack all 100 squares using rand=0 (always picks first available)
    for (let i = 0; i < 100; i++) {
      cpu.randomAttack(enemy.gameboard, () => 0);
    }
    expect(enemy.gameboard.attacks.length).toBe(100);
    const unique = new Set(enemy.gameboard.attacks.map((c) => `${c.x},${c.y}`));
    expect(unique.size).toBe(100);
  });

  test('randomAttack() throws when no moves are left', () => {
    const cpu = new Player('HAL', 'computer');
    const enemy = new Player('Alice');
    for (let i = 0; i < 100; i++) {
      cpu.randomAttack(enemy.gameboard, () => 0);
    }
    expect(() => cpu.randomAttack(enemy.gameboard, () => 0)).toThrow();
  });
});