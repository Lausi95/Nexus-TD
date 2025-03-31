import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import { radiusSquare3x } from 'game/constants/effectiveRadius.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class PlasmaDefender extends DefenderObject {
  plasmaLineWidth: number;
  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.PLASMA,
      name: 'Plasma Turret',
      game,
      maxTargets: 1,
      attackSpeed: 0.6,
      damage: 60,
      effectiveRadius: radiusSquare3x,
      placeholderPosition,
      isProjection,
    });
    this.plasmaLineWidth = 1;
  }

  draw(context: any) {
    this.drawTargetTracing(
      context,
      this.plasmaLineWidth > 1 ? COLOR.PURPLE : COLOR.PRIMARY + '50',
      this.plasmaLineWidth,
    );
    if (this.gameObject.isProjection) {
      this.drawProjection(context);
    }

    context.fillStyle = COLOR.PURPLE;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
  }

  update(_deltaTime: number) {
    this.plasmaLineWidth--;
    this.targetAndDamageEnemies({
      callbackEffect: () => {
        this.plasmaLineWidth = 6;
      },
      priortise: {
        mode: 'preferredElement',
        preferredElement: ELEMENT_TYPE.PLASMA,
      },
    });
  }
}
