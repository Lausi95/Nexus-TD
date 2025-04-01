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

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

type StoneProjectile = {
  position: XY;
  velocity: XY;
  acceleration: number;
  target: XY;
  totalDistance: number;
  minWidth: number;
  maxWidth: number;
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
    this.projectileInterval = 2000;
    this.aoeEffects = [];
  }

  draw(context: any) {
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    context.fillStyle = COLOR.LIGHT_GREY;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );

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

    const aoeEffectWidth = 120;
    for (const aoeEffect of this.aoeEffects) {
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

    // spawn projectiles
    const timeSinceLastProjectile =
      this.gameObject.game.now - this.lastProjectileTime;
    if (timeSinceLastProjectile > this.projectileInterval) {
      const pos = addXY(this.gameObject.position, { x: 20, y: 20 });

      if (this.getAttackersInRange(radiusStoneLeft).length > 0) {
        const target = addXY(pos, { x: -4 * 40, y: 0 });
        this.spawnProjectile(target, radiusStoneLeft);
        this.lastProjectileTime = this.gameObject.game.now;
      }

      if (this.getAttackersInRange(radiusStoneRight).length > 0) {
        const target = addXY(pos, { x: 4 * 40, y: 0 });
        this.spawnProjectile(target, radiusStoneRight);
        this.lastProjectileTime = this.gameObject.game.now;
      }

      if (this.getAttackersInRange(radiusStoneTop).length > 0) {
        const target = addXY(pos, { x: 0, y: -4 * 40 });
        this.spawnProjectile(target, radiusStoneTop);
        this.lastProjectileTime = this.gameObject.game.now;
      }

      if (this.getAttackersInRange(radiusStoneBottom).length > 0) {
        const target = addXY(pos, { x: 0, y: 4 * 40 });
        this.spawnProjectile(target, radiusStoneBottom);
        this.lastProjectileTime = this.gameObject.game.now;
      }
    }

    // update projectiles
    for (const projectile of this.projectiles) {
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
        projectile.minWidth +
        this.deltaWidth(
          projectile.totalDistance,
          targetVectorLength,
          projectile.maxWidth - projectile.minWidth,
        );
    }

    const projectilesToRemove: StoneProjectile[] = [];
    for (const projectile of this.projectiles) {
      if (lengthXY(subXY(projectile.target, projectile.position)) > 5) {
        continue;
      }

      this.aoeEffects.push({
        position: projectile.position,
        fade: 0.5,
      });

      this.enemiesTargeted = this.getAttackersInRange(projectile.targetArea);
      this.damageEnemies();
      this.enemiesTargeted = [];

      projectilesToRemove.push(projectile);
    }
    this.projectiles = this.projectiles.filter(
      (it) => !projectilesToRemove.includes(it),
    );

    const aoeEffectToRemove: AoeEffect[] = [];
    for (const aoeEffect of this.aoeEffects) {
      if (aoeEffect.fade < 0.01) {
        aoeEffectToRemove.push(aoeEffect);
        break;
      }
      aoeEffect.fade = aoeEffect.fade - 0.75 * dt;
    }
    this.aoeEffects = this.aoeEffects.filter(
      (it) => !aoeEffectToRemove.includes(it),
    );
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
    const startPosition = addXY(this.gameObject.position, { x: 20, y: 20 });
    const targetVector = subXY(target, startPosition);
    const velocity = mulXY(normalizeXY(targetVector), 30);

    this.projectiles.push({
      target,
      acceleration: 20,
      position: addXY(this.gameObject.position, { x: 20, y: 20 }),
      velocity: velocity,
      totalDistance: lengthXY(targetVector),
      minWidth: 5,
      maxWidth: 20,
      width: 5,
      targetArea,
    });
  }
}
