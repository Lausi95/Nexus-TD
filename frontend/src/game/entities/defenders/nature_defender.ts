import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import {
  addXY,
  lengthXY,
  mulXY,
  normalizeXY,
  randomXY,
  subXY,
  XY,
} from 'game/types/XY';
import AttackerObject from 'game/engine/AttackerObject';
import { isEnemyInAttackRange } from 'utils/targetDetection';
import { radiusSquare3x } from 'game/constants/effectiveRadius';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

type NatureProjectile = {
  target: AttackerObject;
  position: XY;
  velocity: number;
  acceleration: number;
};

export default class NatureDefender extends DefenderObject {
  projectiles: NatureProjectile[];
  lastProjectileTime: number;
  projectilesPerSecond: number;
  projectileBatchSize: number;
  projectileSpawnInterval: number;

  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.NATURE,
      name: 'Nature Turret',
      game,
      placeholderPosition,
      isProjection,
      effectiveRadius: radiusSquare3x,
    });
    this.projectiles = [];
    this.lastProjectileTime = 0;
    this.projectilesPerSecond = 6;
    this.projectileBatchSize = 1;
    this.projectileSpawnInterval =
      (1000 * this.projectileBatchSize) / this.projectilesPerSecond;
  }

  draw(context: any) {
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    context.fillStyle = COLOR.GREEN;
    for (const projectile of this.projectiles) {
      context.fillRect(
        projectile.position.x - 2,
        projectile.position.y - 2,
        4,
        4,
      );
    }

    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
  }

  update(_deltaTime: number) {
    const dt = _deltaTime / 1000;

    const timeSinceLastProjectileSpawn =
      this.gameObject.game.now - this.lastProjectileTime;
    if (timeSinceLastProjectileSpawn > this.projectileSpawnInterval) {
      this.spawnProjectiles();
      this.lastProjectileTime = this.gameObject.game.now;
    }

    const deadProjectiles: NatureProjectile[] = [];
    for (const projectile of this.projectiles) {
      // check if the targets of the projectiles still exist.
      if (!this.gameObject.game.attackerObjects.includes(projectile.target)) {
        deadProjectiles.push(projectile);
        continue;
      }

      // move and rotate projectile to target direction
      const vecToTarget = subXY(
        projectile.target.gameObject.position,
        projectile.position,
      );

      const direction = normalizeXY(vecToTarget);

      projectile.position = addXY(
        projectile.position,
        mulXY(direction, projectile.velocity * dt),
      );

      projectile.velocity = projectile.velocity + projectile.acceleration * dt;

      // remove projectile if close to enemy and apply damage
      if (lengthXY(vecToTarget) < 10) {
        this.enemiesTargeted.push(projectile.target);
        deadProjectiles.push(projectile);
      }
    }

    this.projectiles = this.projectiles.filter(
      (p) => !deadProjectiles.includes(p),
    );

    if (this.enemiesTargeted.length > 0) {
      this.damageEnemies();
    }
    this.enemiesTargeted = [];
  }

  spawnProjectiles() {
    const attackersInRange = this.getAttackersInRange();
    if (attackersInRange.length > 0) {
      for (let i = 0; i < this.projectileBatchSize; i++) {
        const target = selectRandomItem(attackersInRange)!;
        this.spawnProjectile(target);
      }
    }
  }

  spawnProjectile(target: AttackerObject) {
    const offset = mulXY(randomXY(), 6);
    const projectile: NatureProjectile = {
      target: target,
      position: {
        x: this.gameObject.position.x + 20 + offset.x,
        y: this.gameObject.position.y + 20 + offset.y,
      },
      velocity: 0,
      acceleration: 100,
    };
    this.projectiles.push(projectile);
  }

  getAttackersInRange(): AttackerObject[] {
    return this.gameObject.game.attackerObjects.filter((attacker) =>
      isEnemyInAttackRange(
        this.gameObject.effectiveRadius,
        [this.gameObject.position.x, this.gameObject.position.y],
        [attacker.gameObject.position.x, attacker.gameObject.position.y],
      ),
    );
  }
}

/**
 * Returns a random element of the given array.
 * If the array is empy, `undefined` is returned.
 *
 * @param items Array to select a random item from
 * @returns T Random item, or `undefined`
 */
function selectRandomItem<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
