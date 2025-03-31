import AttackerObject from 'game/engine/AttackerObject.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import PlasmaAttacker from 'game/entities/attackers/plasma_attacker.ts';

export const getElementalDamage = (
  defender: DefenderObject,
  attacker: AttackerObject,
) => {
  let multiplier = 100;

  if (defender.gameObject.elementType === ELEMENT_TYPE.ICE) {
    if (attacker.gameObject.elementType === ELEMENT_TYPE.FIRE) {
      multiplier = 200;
    }
    if (attacker.gameObject.elementType === ELEMENT_TYPE.ELECTRIC) {
      multiplier = 50;
    }
  } else if (defender.gameObject.elementType === ELEMENT_TYPE.FIRE) {
    if (attacker.gameObject.elementType === ELEMENT_TYPE.NATURE) {
      multiplier = 200;
    }
    if (attacker.gameObject.elementType === ELEMENT_TYPE.ICE) {
      multiplier = 50;
    }
  } else if (defender.gameObject.elementType === ELEMENT_TYPE.NATURE) {
    if (attacker.gameObject.elementType === ELEMENT_TYPE.STONE) {
      multiplier = 200;
    }
    if (attacker.gameObject.elementType === ELEMENT_TYPE.FIRE) {
      multiplier = 50;
    }
  } else if (defender.gameObject.elementType === ELEMENT_TYPE.STONE) {
    if (attacker.gameObject.elementType === ELEMENT_TYPE.ELECTRIC) {
      multiplier = 200;
    }
    if (attacker.gameObject.elementType === ELEMENT_TYPE.NATURE) {
      multiplier = 50;
    }
  } else if (defender.gameObject.elementType === ELEMENT_TYPE.ELECTRIC) {
    if (attacker.gameObject.elementType === ELEMENT_TYPE.ICE) {
      multiplier = 200;
    }
    if (attacker.gameObject.elementType === ELEMENT_TYPE.STONE) {
      multiplier = 50;
    }
  }
  if (attacker instanceof PlasmaAttacker && attacker.shieldHp > 0) {
    multiplier = 0;
    if (defender.gameObject.elementType === ELEMENT_TYPE.PLASMA) {
      attacker.shieldHp = Math.max(
        attacker.shieldHp - defender.gameObject.damage * 3,
        0,
      );
    } else {
      attacker.shieldHp = Math.max(
        attacker.shieldHp - defender.gameObject.damage,
        0,
      );
    }
  }

  return (multiplier * defender.gameObject.damage) / 100;
};
