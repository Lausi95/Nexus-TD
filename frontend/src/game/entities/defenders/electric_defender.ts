import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import AttackerObject from 'game/engine/AttackerObject';
import { isEnemyInAttackRange } from 'utils/targetDetection';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class ElectricDefender extends DefenderObject {
  chainLightningRadius: number = 40 * 40;

  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.ELECTRIC,
      name: 'Electric Turret',
      maxTargets: 3,
      game,
      placeholderPosition,
      isProjection,
      damage: 2,
    });
  }

  draw(context: any) {
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    // collect positions
    context.lineWidth = 1;
    context.strokeStyle = COLOR.YELLOW;
    const positions = [
      [this.gameObject.position.x + 20, this.gameObject.position.y + 20],
    ];
    this.enemiesTargeted.forEach((attacker) => {
      positions.push([
        attacker.gameObject.position.x + 6,
        attacker.gameObject.position.y + 6,
      ]);
    });

    for (let i = 0; i < positions.length - 1; i++) {
      context.beginPath();
      let currentPosition = positions[i];
      const targetPosition = positions[i + 1];

      // draw random displaced line sections to the target,
      // until a distance threshold
      while (
        distance2(
          currentPosition[0],
          currentPosition[1],
          targetPosition[0],
          targetPosition[1],
        ) > 25
      ) {
        // determine vector between target and current position
        const vec = [
          targetPosition[0] - currentPosition[0],
          targetPosition[1] - currentPosition[1],
        ];

        // shrink the vector and displace it by a random offset
        const normalized = [
          vec[0] / 5 + Math.random() * 6 - 3,
          vec[1] / 5 + Math.random() * 6 - 3,
        ];

        // apply randomized and shrinked vector to current position
        const nextPosition = [
          currentPosition[0] + normalized[0],
          currentPosition[1] + normalized[1],
        ];

        context.moveTo(currentPosition[0], currentPosition[1]);
        context.lineTo(nextPosition[0], nextPosition[1]);
        context.stroke();

        currentPosition = nextPosition;
      }

      // draw a last line direct to the target for visual consistency
      context.moveTo(currentPosition[0], currentPosition[1]);
      context.lineTo(targetPosition[0], targetPosition[1]);
      context.stroke();
    }

    context.fillStyle = COLOR.YELLOW;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
  }

  update(_deltaTime: number) {
    // determine the closest enemy in attack range
    const attackersInRange = this.gameObject.game.attackerObjects.filter(
      (attacker) =>
        isEnemyInAttackRange(
          this.gameObject.effectiveRadius,
          [this.gameObject.position.x, this.gameObject.position.y],
          [attacker.gameObject.position.x, attacker.gameObject.position.y],
        ),
    );

    const closestAttacker = this.closestAttacker(attackersInRange);

    if (closestAttacker) {
      // determine n next closest enemies, relative to the previous closest enemy within a certain range
      const targets = [closestAttacker];
      let lastTarget = closestAttacker;

      for (let i = 0; i < this.gameObject.maxTargets - 1; i++) {
        const targetCandidates = this.gameObject.game.attackerObjects.filter(
          (attacker) => !targets.includes(attacker),
        );

        const nextClosestAttacker = closestAttackerToAttacker(
          lastTarget,
          targetCandidates,
          this.chainLightningRadius,
        );

        if (!nextClosestAttacker) {
          break;
        }

        targets.push(nextClosestAttacker);
        lastTarget = nextClosestAttacker;
      }
      this.enemiesTargeted = targets;
    } else {
      this.enemiesTargeted = [];
    }

    this.damageEnemies();
  }

  closestAttacker(attackers: AttackerObject[]): AttackerObject | undefined {
    let closest: AttackerObject | undefined = undefined;
    let closestDistance = Infinity;
    for (const attacker of attackers) {
      const distance = distanceDefenderToAttacker(this, attacker);
      if (distance < closestDistance) {
        closest = attacker;
        closestDistance = distance;
      }
    }
    return closest;
  }
}

function closestAttackerToAttacker(
  attacker: AttackerObject,
  attackers: AttackerObject[],
  radius: number,
) {
  let closest: AttackerObject | undefined = undefined;
  let closestDistance = Infinity;
  for (const it of attackers) {
    const distance = distanceAttackerToAttacker(attacker, it);
    if (distance < closestDistance && distance < radius) {
      closest = it;
      closestDistance = distance;
    }
  }
  return closest;
}

function distanceAttackerToAttacker(
  attacker1: AttackerObject,
  attacker2: AttackerObject,
) {
  return distance2(
    attacker1.gameObject.position.x,
    attacker1.gameObject.position.y,
    attacker2.gameObject.position.x,
    attacker2.gameObject.position.y,
  );
}

function distanceDefenderToAttacker(
  defender: DefenderObject,
  attacker: AttackerObject,
) {
  return distance2(
    defender.gameObject.position.x,
    defender.gameObject.position.y,
    attacker.gameObject.position.x,
    attacker.gameObject.position.y,
  );
}

/**
 * Returns the squared distance between two coordinates.
 */
function distance2(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
}
