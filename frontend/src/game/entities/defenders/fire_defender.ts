import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { radiusCross2x } from 'game/enum/effectiveRadius.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class FireDefender extends DefenderObject {
  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.FIRE,
      name: 'Fire Turret',
      game,
      placeholderPosition,
      isProjection,
      effectiveRadius: radiusCross2x,
    });
  }

  draw(context: any) {
    this.drawTargetTracing(context);
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
  }

  update(_deltaTime: number) {
    this.targetAndDamageEnemies();
  }
}
