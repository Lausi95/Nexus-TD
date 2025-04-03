import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import {
  radiusStoneBottom,
  radiusStoneLeft,
  radiusStoneRight,
  radiusStoneTop,
  radiusStoneTower,
} from 'game/constants/effectiveRadius';
import { addXY, lengthXY, mulXY, normalizeXY, subXY, XY } from 'game/types/XY';
import { EffectiveRadius } from 'game/types/EffectiveRadius';
import { TILE_SIZE } from 'game/constants';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

const PROJECTILE_MIN_WIDTH = 5;
const PROJECTILE_MAX_WIDTH = 20;
const PROJECTILE_WIDTH_DIFFERENCE = PROJECTILE_MAX_WIDTH - PROJECTILE_MIN_WIDTH;
const STONE_TOWER_RANGE = 4;

type TargetArea = {
  effectiveRadius: EffectiveRadius;
  targetVector: XY;
};

const STONE_TOWER_TARGET_AREAS: TargetArea[] = [
  {
    effectiveRadius: radiusStoneRight,
    targetVector: {
      x: STONE_TOWER_RANGE * TILE_SIZE,
      y: 0,
    },
  },
  {
    effectiveRadius: radiusStoneLeft,
    targetVector: {
      x: -STONE_TOWER_RANGE * TILE_SIZE,
      y: 0,
    },
  },
  {
    effectiveRadius: radiusStoneBottom,
    targetVector: {
      x: 0,
      y: STONE_TOWER_RANGE * TILE_SIZE,
    },
  },
  {
    effectiveRadius: radiusStoneTop,
    targetVector: {
      x: 0,
      y: -STONE_TOWER_RANGE * TILE_SIZE,
    },
  },
];

type StoneProjectile = {
  position: XY;
  velocity: XY;
  acceleration: number;
  target: XY;
  totalDistance: number;
  width: number;
  targetArea: EffectiveRadius;
};

type AoeEffect = {
  position: XY;
  fade: number;
};

export default class StoneDefender extends DefenderObject {
  projectiles: StoneProjectile[];
  projectileInterval: number;
  lastProjectileTime: number;
  aoeEffects: AoeEffect[];
  initialVelocityScalar: number;
  accelerationScalar: number;

  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.STONE,
      name: 'Stone Turret',
      game,
      placeholderPosition,
      damage: 30,
      isProjection,
      effectiveRadius: radiusStoneTower,
    });
    this.projectiles = [];
    this.lastProjectileTime = 0;
    this.projectileInterval = 3000;
    this.aoeEffects = [];
    this.initialVelocityScalar = 30;
    this.accelerationScalar = 20;
  }

  draw(context: any) {
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    this.drawDefender(context);
    this.drawAoeEffects(context);
    this.drawProjectiles(context);
  }

  drawDefender(context: any) {
    context.fillStyle = COLOR.LIGHT_GREY;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
  }

  drawProjectiles(context: any) {
    for (const projectile of this.projectiles) {
      context.fillStyle = COLOR.LIGHT_GREY;
      context.fillRect(
        projectile.position.x - projectile.width / 2,
        projectile.position.y - projectile.width / 2,
        projectile.width,
        projectile.width,
      );

      context.strokeStyle = COLOR.BLACK;
      context.lineWidth = 1;
      context.strokeRect(
        projectile.position.x - projectile.width / 2,
        projectile.position.y - projectile.width / 2,
        projectile.width,
        projectile.width,
      );
    }
  }

  drawAoeEffects(context: any) {
    const aoeEffectWidth = TILE_SIZE * 3;
    for (const aoeEffect of this.aoeEffects) {
      // prevents flickering frames
      if (aoeEffect.fade < 0) {
        continue;
      }

      context.fillStyle = COLOR.LIGHT_GREY;
      context.globalAlpha = aoeEffect.fade;
      context.fillRect(
        aoeEffect.position.x - aoeEffectWidth / 2,
        aoeEffect.position.y - aoeEffectWidth / 2,
        aoeEffectWidth,
        aoeEffectWidth,
      );
      context.globalAlpha = 1;
    }
  }

  update(_deltaTime: number) {
    const dt = _deltaTime / 1000;
    this.updateProjectileSpawn();
    this.updateProjectiles(dt);
    this.updateAoeEffects(dt);
  }

  updateProjectileSpawn() {
    const now = this.gameObject.game.now;
    const timeSinceLastProjectile = now - this.lastProjectileTime;
    if (timeSinceLastProjectile > this.projectileInterval) {
      for (const targetArea of STONE_TOWER_TARGET_AREAS) {
        if (this.getAttackersInRange(targetArea.effectiveRadius).length > 0) {
          const target = addXY(this.getCenter(), targetArea.targetVector);
          this.spawnProjectile(target, targetArea.effectiveRadius);
          this.lastProjectileTime = this.gameObject.game.now;
        }
      }
    }
  }

  updateProjectiles(dt: number) {
    const projectilesToRemove: StoneProjectile[] = [];
    for (const projectile of this.projectiles) {
      if (lengthXY(subXY(projectile.target, projectile.position)) < 5) {
        this.aoeEffects.push({
          position: projectile.position,
          fade: 0.5,
        });

        this.enemiesTargeted = this.getAttackersInRange(projectile.targetArea);
        this.damageEnemies();
        this.enemiesTargeted = [];

        projectilesToRemove.push(projectile);
        continue;
      }

      const dPosition = mulXY(projectile.velocity, dt);
      projectile.position = addXY(projectile.position, dPosition);

      projectile.velocity = addXY(
        projectile.velocity,
        mulXY(normalizeXY(projectile.velocity), projectile.acceleration * dt),
      );

      const targetVectorLength = lengthXY(
        subXY(projectile.target, projectile.position),
      );

      projectile.width =
        PROJECTILE_MIN_WIDTH +
        this.deltaWidth(
          projectile.totalDistance,
          targetVectorLength,
          PROJECTILE_WIDTH_DIFFERENCE,
        );
    }
    this.projectiles = arrayWithout(this.projectiles, projectilesToRemove);
  }

  updateAoeEffects(dt: number) {
    const aoeEffectToRemove: AoeEffect[] = [];
    for (const aoeEffect of this.aoeEffects) {
      if (aoeEffect.fade < 0.01) {
        aoeEffectToRemove.push(aoeEffect);
        break;
      }
      aoeEffect.fade = aoeEffect.fade - 0.75 * dt;
    }
    this.aoeEffects = arrayWithout(this.aoeEffects, aoeEffectToRemove);
  }

  /**
   * Quadratic formula for calculating the projectile width, so it appeares
   * to fly into the sky.
   *
   * The formula is based on these predefeined fuction values:
   * f(x) := a*x^2 + b*x + c
   * f(0) := 0
   * f(L/2) := w
   * f(L) := 0
   *
   * Resolving this, leads to the following values of a, b, c:
   * a := -4w/L^2
   * b := 4w/L
   * c := 0
   *
   * @param L total distance between spawn point and target
   * @param l current distance to target
   * @param w max width delta
   */
  deltaWidth(L: number, l: number, w: number): number {
    return -(4 * w * l * l) / (L * L) + (4 * w * l) / L;
  }

  spawnProjectile(target: XY, targetArea: EffectiveRadius) {
    const startPosition = this.getCenter();
    const targetVector = subXY(target, startPosition);
    const velocity = mulXY(
      normalizeXY(targetVector),
      this.initialVelocityScalar,
    );

    this.projectiles.push({
      target,
      acceleration: this.accelerationScalar,
      position: startPosition,
      velocity: velocity,
      totalDistance: lengthXY(targetVector),
      width: PROJECTILE_MIN_WIDTH,
      targetArea,
    });
  }

  /**
   * Center point of the defender.
   */
  getCenter(): XY {
    return addXY(this.gameObject.position, { x: 20, y: 20 });
  }
}

/**
 * Resolves an array of the first given array without the elements of
 * the second given array.
 *
 * Basically does the cut operation.
 *
 * @param array Array to remove elements from
 * @param excludingElements Array of elements to remove
 */
function arrayWithout<T>(array: T[], excludingElements: T[]): T[] {
  return array.filter((it) => !excludingElements.includes(it));
}
