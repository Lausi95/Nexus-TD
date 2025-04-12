import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import { TILE_SIZE } from 'game/constants';
import { radiusSquare3x } from 'game/constants/effectiveRadius.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class BlackHole extends DefenderObject {
  pulseTimer: number;

  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      name: 'Sonic Black Hole',
      id: ENTITY_ID.STAR,
      elementType: ELEMENT_TYPE.BLACK_HOLE,
      game,
      damage: 4,
      placeholderPosition,
      effectiveRadius: radiusSquare3x,
      isProjection,
    });
    this.pulseTimer = 0;
  }

  draw(context: any) {
    this.drawTargetTracing(context);
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }
    context.globalAlpha = 0.2;
    context.fillStyle = COLOR.VENOM;
    context.fillRect(
      this.gameObject.position.x - TILE_SIZE * 3,
      this.gameObject.position.y - TILE_SIZE * 3,
      TILE_SIZE * 7,
      TILE_SIZE * 7,
    );
    context.globalAlpha = 1;

    context.fillStyle = COLOR.VENOM;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
    context.fillStyle = COLOR.BLACK;
    context.fillRect(
      this.gameObject.position.x + 12,
      this.gameObject.position.y + 12,
      16,
      16,
    );
    const offset = 120 * (1 - this.pulseTimer / 100);
    context.strokeStyle = COLOR.BLACK;
    context.strokeRect(
      this.gameObject.position.x + 10 - offset,
      this.gameObject.position.y + 10 - offset,
      20 + offset * 2,
      20 + offset * 2,
    );
  }

  update(_deltaTime: number) {
    this.targetAndDamageEnemies();

    this.pulseTimer += 4;
    if (this.pulseTimer > 100) {
      this.pulseTimer = 0;
    }
  }
}
