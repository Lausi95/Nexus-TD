import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import GameObject from 'game/engine/gameObject.ts';
import Game from 'game/engine/game.ts';
import TrackTile from 'game/entities/tiles/TrackTile.ts';
import PlaceholderTile from 'game/entities/tiles/PlaceholderTile.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class BasicDefender extends GameObject {
  game: Game;
  placeholderPosition: [number, number];
  maxTargets: number;
  lastAttackTimestamp: number;
  attackSpeed: number;
  damage: number;
  enemiesTargeted: AttackerObject[];
  isProjection: boolean;
  cost: number;

  constructor({ game, placeholderPosition, isProjection = false }: TProps) {
    super({
      id: ENTITY_ID.STAR,
      position: {
        x: placeholderPosition[0] * 40,
        y: placeholderPosition[1] * 40,
      },
      velocity: 0,
    });
    this.game = game;
    this.placeholderPosition = placeholderPosition;
    this.maxTargets = 1;
    this.lastAttackTimestamp = 0;
    this.attackSpeed = 2;
    this.damage = 20;
    this.enemiesTargeted = [];
    (this.isProjection = isProjection), (this.cost = 10);
  }

  // getBounds() {
  //   const rectangle: Rectangle = {
  //     x: this.gameObject.position.x,
  //     y: this.gameObject.position.y,
  //     width: this.gameObject.width,
  //     height: this.gameObject.height,
  //   };
  //   return rectangle;
  // }

  draw(context: any) {
    let colorHighlight = COLOR.PRIMARY;

    if (
      this.game.arena.loadedTrack.find(
        (tile) =>
          tile[0] === this.placeholderPosition[0] &&
          tile[1] === this.placeholderPosition[1],
      )
    ) {
      colorHighlight = COLOR.RED;
    }
    context.fillStyle = colorHighlight;
    context.fillRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
    context.strokeStyle = colorHighlight;
    context.lineWidth = 1; // Set line width
    this.enemiesTargeted.forEach((enemy) => {
      context.beginPath();
      context.moveTo(
        this.gameObject.position.x + 20,
        this.gameObject.position.y + 20,
      );
      context.lineTo(
        enemy.gameObject.position.x + 5,
        enemy.gameObject.position.y + 5,
      );
      context.stroke();
    });
    if (this.isProjection) {
      context.strokeStyle = colorHighlight;
      context.beginPath();
      context.rect(
        this.placeholderPosition[0] * 40 - 80 + 5,
        this.placeholderPosition[1] * 40 - 80 + 5,
        200 - 10,
        200 - 10,
      );
      context.stroke();
    }
  }

  update(_deltaTime: number) {
    const newArray: AttackerObject[] = [];
    this.game.attackerObjects.forEach((gameObj) => {
      if (
        newArray.length < this.maxTargets &&
        gameObj.gameObject.id === ENTITY_ID.BASIC_ENEMY
      ) {
        if (
          gameObj.gameObject.position.x >=
            this.placeholderPosition[0] * 40 - 80 &&
          gameObj.gameObject.position.x <=
            this.placeholderPosition[0] * 40 + 120 &&
          gameObj.gameObject.position.y >=
            this.placeholderPosition[1] * 40 - 80 &&
          gameObj.gameObject.position.y <=
            this.placeholderPosition[1] * 40 + 120
        ) {
          newArray.push(gameObj);
        }
      }
    });
    this.enemiesTargeted = newArray;
    if (this.game.now >= this.lastAttackTimestamp + 1000 / this.attackSpeed) {
      this.lastAttackTimestamp = this.game.now;
      this.enemiesTargeted.forEach((enemy) => {
        enemy.gameObject.hp = Math.max(0, enemy.gameObject.hp - this.damage);
      });
    }
  }
}
