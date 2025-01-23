import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import { Rectangle } from 'game/types/Rectangle.ts';
import Game from 'game/engine/game.ts';
import BasicBullet from './basic_bullet.ts';

type TProps = {
  game: Game;
  position?: { x: number; y: number };
  velX?: number;
  velY?: number;
  skipAwakening?: boolean;
};

export default class BasicBoss extends GameObject {
  game: Game;
  awaken: boolean;
  bullet_timer: number;
  awakening_timer: number;
  skipAwakening: boolean;

  constructor({ game, position, velX = 0, velY = 0.3, skipAwakening = false }: TProps) {
    super({
      id: ENTITY_ID.BOSS,
      width: 50,
      height: 50,
      position: position ? position : { x: game.canvas.canvasWidth / 2 - 25, y: -60 },
      velY,
      velX,
    });

    this.game = game;
    this.awaken = false;
    this.awakening_timer = 0;
    this.bullet_timer = 0;
    this.skipAwakening = skipAwakening;
  }

  getBounds() {
    const rectangle: Rectangle = {
      x: this.gameObject.position.x,
      y: this.gameObject.position.y,
      width: this.gameObject.width,
      height: this.gameObject.height,
    };
    return rectangle;
  }

  fear() {
    // DO nothing
  }

  awakenFunction() {
    if (!this.awaken && this.skipAwakening) {
      this.awaken = true;
    } else if (!this.awaken && this.gameObject.position.y >= 10) {
      this.awaken = true;
      this.gameObject.velY = 0;
      this.gameObject.velX = 5;
    }
  }

  fireBullets() {
    this.bullet_timer++;
    if (this.awaken && this.bullet_timer % 40 === 0) {
      const offset = this.gameObject.velX > 0 ? 20 : -20;
      const origin_x = this.gameObject.position.x + this.gameObject.width / 2 + offset;
      const origin_y = this.gameObject.position.y + this.gameObject.height - 5;
      this.game.gameObjects.push(
        new BasicBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: -3,
          velY: 4,
        }),
      );
      this.game.gameObjects.push(
        new BasicBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 0,
          velY: 5,
        }),
      );
      this.game.gameObjects.push(
        new BasicBullet({
          game: this.game,
          position: { x: origin_x, y: origin_y },
          velX: 3,
          velY: 4,
        }),
      );
    }
  }

  draw(context: any) {
    context.fillStyle = COLOR.RED;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      this.gameObject.width,
      this.gameObject.height,
    );
  }

  update(_deltaTime: number) {
    this.awakenFunction();
    this.fireBullets();
    // Updating the entity's position based on its velocity (if it has one)
    this.gameObject.position.x += this.gameObject.velX;
    this.gameObject.position.y += this.gameObject.velY;

    if (
      this.gameObject.position.x <= 0 ||
      this.gameObject.position.x >= this.game.canvas.canvasWidth - this.gameObject.width
    )
      this.gameObject.velX *= -1;
  }
}
