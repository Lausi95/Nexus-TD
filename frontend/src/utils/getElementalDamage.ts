import AttackerObject from 'game/engine/AttackerObject.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';

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

  return (multiplier * defender.gameObject.damage) / 100;
};
