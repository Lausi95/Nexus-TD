import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import { radiusSquare1x } from 'game/constants/effectiveRadius.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class IceDefender extends DefenderObject {
  pulseTimer: number;

  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      name: 'ICE Turret',
      id: ENTITY_ID.STAR,
      elementType: ELEMENT_TYPE.ICE,
      game,
      attackSpeed: 4,
      damage: 2,
      placeholderPosition,
      effectiveRadius: radiusSquare1x,
      isProjection,
    });
    this.pulseTimer = 0;
  }

  draw(context: any) {
    // this.drawTargetTracing(context);
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    context.fillStyle = COLOR.PORTAL_BLUE;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
    const offset = (80 * this.pulseTimer) / 100;
    context.strokeStyle = COLOR.PORTAL_BLUE;
    context.globalAlpha = 0.4;
    context.strokeRect(
      this.gameObject.position.x + 10 - offset,
      this.gameObject.position.y + 10 - offset,
      20 + offset * 2,
      20 + offset * 2,
    );
    context.globalAlpha = 1;
  }

  getPulseIncrement(current: number): number {
    const t = current / 60; // Normalize: 0 to 1
    const eased = 1 - (1 - t) * (1 - t); // easeOutQuad
    const speed = 1 + (1 - eased) * 3; // Starts at ~5, slows to 1
    return speed;
  }

  update(_deltaTime: number) {
    this.targetAndDamageEnemies({
      callbackEffect: () => {
        this.enemiesTargeted.forEach(
          (enemy) => (enemy.lastTimeFreezed = this.gameObject.game.now),
        );
      },
    });
    if (this.enemiesTargeted.length > 0) {
      this.pulseTimer += this.getPulseIncrement(this.pulseTimer);
      if (this.pulseTimer > 60) {
        this.pulseTimer = 0;
      }
    } else {
      this.pulseTimer = 0;
    }
  }
}
