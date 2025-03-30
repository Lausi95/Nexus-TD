import Game from '../../Game.ts';
import { sec } from 'utils/deltaTime.ts';
import IceAttacker from 'game/entities/attackers/ice_attacker.ts';
import FireAttacker from 'game/entities/attackers/fire_attacker.ts';
import NatureAttacker from 'game/entities/attackers/nature_attacker.ts';
import StoneAttacker from 'game/entities/attackers/stone_attacker.ts';
import PlasmaAttacker from 'game/entities/attackers/plasma_attacker.ts';
import ElectricAttack from 'game/entities/attackers/electric_attacker.ts';

export const wave0 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      game.attackerObjects.push(new FireAttacker({ game }));
    } else if (game.spawner.roundTimer === sec(0.5)) {
      game.attackerObjects.push(new IceAttacker({ game }));
    } else if (game.spawner.roundTimer === sec(1)) {
      game.attackerObjects.push(new NatureAttacker({ game }));
    } else if (game.spawner.roundTimer === sec(1.5)) {
      game.attackerObjects.push(new StoneAttacker({ game }));
    } else if (game.spawner.roundTimer === sec(2)) {
      game.attackerObjects.push(new PlasmaAttacker({ game }));
    } else if (game.spawner.roundTimer === sec(2.5)) {
      game.attackerObjects.push(new ElectricAttack({ game }));
    } else if (game.spawner.roundTimer === sec(3)) {
      // game.attackerObjects.push(new Enemy({ game }));
    }
  }
  return null;
};
