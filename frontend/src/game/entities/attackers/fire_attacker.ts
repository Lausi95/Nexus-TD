import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';
import { drawDiamond, drawHpBar } from 'utils/draw/draw.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
};

export default class FireAttacker extends AttackerObject {
  constructor({ game, position }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.FIRE,
      position,
      game,
    });
  }

  draw(context: any) {
    drawDiamond(context, this, COLOR.ORANGE);
    drawHpBar(context, this);
  }

  update(_deltaTime: number) {
    this.updateMovement();
  }
}
