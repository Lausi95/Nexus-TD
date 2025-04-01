import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import { XY } from 'game/types/XY';
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
      const vecToTarget = subVec2(
        projectile.target.gameObject.position,
        projectile.position,
      );

      const direction = normalizeVec2(vecToTarget);

      projectile.position = addVec2(
        projectile.position,
        mulVec2(direction, projectile.velocity * dt),
      );

      projectile.velocity = projectile.velocity + projectile.acceleration * dt;

      // remove projectile if close to enemy and apply damage
      if (lengthVec2(vecToTarget) < 10) {
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
    const offset = mulVec2(randomVec2(), 6);
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
 * Normalizes a vector.
 * Normalized means, that the length of the vector is 1.
 */
function normalizeVec2(vec: XY): XY {
  const length = lengthVec2(vec);
  return { x: vec.x / length, y: vec.y / length };
}

/**
 * Adds two vectors and returns the vector sum.
 */
function addVec2(vec1: XY, vec2: XY): XY {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

/**
 * Subtracts two vectors and returns the vector difference.
 */
function subVec2(vec1: XY, vec2: XY): XY {
  return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

/**
 * Determines the length of a vector and returns the length.
 */
function lengthVec2(vec: XY): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * Multiplies the vector with a factor and returns the resulting vector.
 */
function mulVec2(vec: XY, factor: number): XY {
  return {
    x: vec.x * factor,
    y: vec.y * factor,
  };
}

/**
 * Creates a new random normalized vector.
 * Normalized means, that the length of the vector is 1.
 */
function randomVec2(): XY {
  const random = Math.random() * 2 * Math.PI;
  return {
    x: Math.sin(random),
    y: Math.cos(random),
  };
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
