import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class BasicDefender extends DefenderObject {
  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      name: 'Turret A',
      id: ENTITY_ID.STAR,
      game,
      placeholderPosition,
      isProjection,
    });
  }

  draw(context: any) {
    context.fillStyle = COLOR.PRIMARY;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
    this.drawTargetTracing(context);

    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }
  }

  update(_deltaTime: number) {
    this.targetAndDamageEnemies();
  }
}
