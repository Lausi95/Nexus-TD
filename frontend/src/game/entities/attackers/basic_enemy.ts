import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/game.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
};

const getVelocityTilesPerSecond = (vel: number) => {
  return vel * 40;
};

export default class BasicEnemy extends AttackerObject {
  constructor({ game, position = { x: 0, y: 0 } }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      position,
      velocity: getVelocityTilesPerSecond(1.5),
      hp: 100,
      nextTrack: null,
      numberTrack: 0,
      game,
    });
  }

  draw(context: any) {
    context.fillStyle = COLOR.RED;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      10,
      10,
    );
    if (this.gameObject.hp > 0 && this.gameObject.hp <= 100) {
      context.strokeStyle = COLOR.RED;
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(
        this.gameObject.position.x + 5 - (this.gameObject.hp / 100) * 14,
        this.gameObject.position.y - 5,
      );
      context.lineTo(
        this.gameObject.position.x + 5 + (this.gameObject.hp / 100) * 14,
        this.gameObject.position.y - 5,
      );
      context.stroke();
      context.lineWidth = 1;
    }
  }

  update(_deltaTime: number) {
    this.updateMovement();
  }
}
