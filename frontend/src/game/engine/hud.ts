import { getSec } from 'utils/deltaTime.ts';
import Game from './game';

type HudProps = {
  game: Game;
};

export default class Hud {
  game: Game;
  deltaTime: number;
  fps: number;

  constructor({ game }: HudProps) {
    this.game = game;
    this.deltaTime = 0;
    this.fps = 0;
  }

  update(deltaTime: number) {
    if (this.game.dev) {
      this.deltaTime = Math.round(deltaTime * 100) / 100;
      this.fps = Math.round((1000 / this.deltaTime) * 10) / 10;
    }
  }

  draw(context: any) {
    // Developer Option
    if (this.game.dev) {
      context.fillStyle = 'white';
      context.font = '12px Arial';
      context.fillText(
        `Timer: ${this.game.spawner.roundTimer}, ${getSec(this.game.spawner.roundTimer)}`,
        130,
        15,
      );
      context.fillText(`gameObjects: ${this.game.gameObjects.length}`, 130, 30);
      context.fillText(`deltaTime: ${this.deltaTime}`, 130, 45);
      context.fillText(`fps: ${this.fps}`, 130, 60);
      context.fillText(`LVL: ${this.game.level}`, 130, 75);
      context.strokeStyle = 'white';
    }
  }

  roundedRectangle(
    context: any,
    x: number,
    y: number,
    width: number,
    height: number,
    rounded: number,
  ) {
    //const radiansInCircle = 2 * Math.PI;
    const halfRadians = (2 * Math.PI) / 2;
    const quarterRadians = (2 * Math.PI) / 4;

    // top left arc
    context.arc(
      rounded + x,
      rounded + y,
      rounded,
      -quarterRadians,
      halfRadians,
      true,
    );

    // line from top left to bottom left
    context.lineTo(x, y + height - rounded);

    // bottom left arc
    context.arc(
      rounded + x,
      height - rounded + y,
      rounded,
      halfRadians,
      quarterRadians,
      true,
    );

    // line from bottom left to bottom right
    context.lineTo(x + width - rounded, y + height);

    // bottom right arc
    context.arc(
      x + width - rounded,
      y + height - rounded,
      rounded,
      quarterRadians,
      0,
      true,
    );

    // line from bottom right to top right
    context.lineTo(x + width, y + rounded);

    // top right arc
    context.arc(
      x + width - rounded,
      y + rounded,
      rounded,
      0,
      -quarterRadians,
      true,
    );

    // line from top right to top left
    context.lineTo(x + rounded, y);
  }
}
