import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
};

const getVelocityTilesPerSecond = (vel: number) => {
  return vel * 40;
};

const getPosition = (startingPlaceholder: [number, number]) => {
  if (startingPlaceholder[0] === 0) {
    return { x: -40, y: startingPlaceholder[1] * 40 + 10 };
  } else if (startingPlaceholder[1] === 0) {
    return { x: startingPlaceholder[0] * 40 + 10, y: -40 };
  }
  return { x: 0, y: 0 };
};

export default class BasicEnemy extends AttackerObject {
  constructor({ game, position }: TProps) {
    super({
      id: ENTITY_ID.BASIC_ENEMY,
      position: position || getPosition(game.arena.loadedTrack[0]),
      velocity: getVelocityTilesPerSecond(2),
      hp: 100,
      nextTrack: null,
      numberTrack: 0,
      damage: 10,
      gold: 10,
      platinum: 1,
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
