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

export default class PlasmaAttacker extends AttackerObject {
  shieldHp: number;
  maxShieldHp: number;

  constructor({ game, position }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      elementType: ELEMENT_TYPE.PLASMA,
      position,
      game,
    });
    this.shieldHp = 300;
    this.maxShieldHp = 300;
  }

  draw(context: any) {
    drawDiamond(context, this, COLOR.PURPLE);
    drawHpBar(context, this);

    const radius = 9;
    context.beginPath();
    context.arc(
      this.gameObject.position.x + 6,
      this.gameObject.position.y + 6,
      radius,
      0,
      Math.PI * 2,
    );
    context.strokeStyle = COLOR.BLACK;
    context.lineWidth = 1;
    context.stroke();

    context.beginPath();
    context.arc(
      this.gameObject.position.x + 6,
      this.gameObject.position.y + 6,
      radius,
      0,
      Math.PI * 2 * (this.shieldHp / this.maxShieldHp),
    );
    context.strokeStyle = COLOR.PURPLE;
    context.lineWidth = 1;
    context.stroke();
  }

  update(_deltaTime: number) {
    this.updateMovement();
  }
}
