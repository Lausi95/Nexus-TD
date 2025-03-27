import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { radiusCross2x } from 'game/enum/effectiveRadius.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class FlamethrowerDefener extends DefenderObject {
  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      name: 'Flamethrower',
      game,
      placeholderPosition,
      isProjection,
      effectiveRadius: radiusCross2x,
    });
  }

  draw(context: any) {
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    context.fillStyle = COLOR.ORANGE;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
    this.drawTargetTracing(context);
  }

  update(_deltaTime: number) {
    this.targetAndDamageEnemies();
  }
}
