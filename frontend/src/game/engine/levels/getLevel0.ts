import { Stars } from '../../types/Stars';
import Game from '../game';
import { sec } from 'utils/deltaTime.ts';
import BasicEnemy from 'game/entities/attackers/basic_enemy.ts';

export const level0Stars: Stars = [3, 15, 30];

export const getLevel0 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    } else if (game.spawner.roundTimer === sec(0.5)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    } else if (game.spawner.roundTimer === sec(1)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    } else if (game.spawner.roundTimer === sec(2.5)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    } else if (game.spawner.roundTimer === sec(3)) {
      game.attackerObjects.push(new BasicEnemy({ game }));
    }
  }
  return null;
};
