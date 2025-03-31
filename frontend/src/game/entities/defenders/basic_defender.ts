import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class BasicDefender extends DefenderObject {
  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      name: 'Basic Defender',
      id: ENTITY_ID.STAR,
      elementType: ELEMENT_TYPE.UNKOWN,
      game,
      damage: 4,
      placeholderPosition,
      isProjection,
    });
  }

  draw(context: any) {
    this.drawTargetTracing(context);
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    context.fillStyle = COLOR.PRIMARY;
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
