import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { COLOR } from 'game/enum/colors.ts';
import Game from 'game/engine/Game.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { DefenderInspectionDetails } from 'game/types/InspectionDetails.ts';

type TProps = {
  game: Game;
  placeholderPosition: [number, number];
  isProjection?: boolean;
};

export default class BasicDefender extends DefenderObject {
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
      game,
      position: {
        x: placeholderPosition[0] * 40,
        y: placeholderPosition[1] * 40,
      },
      placeholderPosition,
    });
    this.maxTargets = 1;
    this.lastAttackTimestamp = 0;
    this.attackSpeed = 3;
    this.damage = 10;
    this.enemiesTargeted = [];
    this.isProjection = isProjection;
    this.cost = 10;
  }

  getInspectDetails(): DefenderInspectionDetails {
    return {
      name: 'Turret A',
      damage: this.damage,
      attackSpeed: this.attackSpeed,
      radius: 2,
    };
  }

  drawProjection(context: any, color: string) {
    context.strokeStyle = color;
    context.beginPath();
    context.rect(
      this.gameObject.placeholderPosition[0] * 40 - 80 + 5,
      this.gameObject.placeholderPosition[1] * 40 - 80 + 5,
      200 - 10,
      200 - 10,
    );
    context.stroke();
  }

  draw(context: any) {
    let colorHighlight = COLOR.PRIMARY;

    if (
      this.gameObject.game.arena.loadedTrack.find(
        (tile) =>
          tile[0] === this.gameObject.placeholderPosition[0] &&
          tile[1] === this.gameObject.placeholderPosition[1],
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
      this.drawProjection(context, colorHighlight);
    }
  }

  update(_deltaTime: number) {
    const newArray: AttackerObject[] = [];
    this.gameObject.game.attackerObjects.forEach((gameObj) => {
      if (
        newArray.length < this.maxTargets &&
        gameObj.gameObject.id === ENTITY_ID.BASIC_ENEMY
      ) {
        if (
          gameObj.gameObject.position.x >=
            this.gameObject.placeholderPosition[0] * 40 - 80 &&
          gameObj.gameObject.position.x <=
            this.gameObject.placeholderPosition[0] * 40 + 120 &&
          gameObj.gameObject.position.y >=
            this.gameObject.placeholderPosition[1] * 40 - 80 &&
          gameObj.gameObject.position.y <=
            this.gameObject.placeholderPosition[1] * 40 + 120
        ) {
          newArray.push(gameObj);
        }
      }
    });
    this.enemiesTargeted = newArray;
    if (
      this.gameObject.game.now >=
      this.lastAttackTimestamp + 1000 / this.attackSpeed
    ) {
      this.lastAttackTimestamp = this.gameObject.game.now;
      this.enemiesTargeted.forEach((enemy) => {
        enemy.gameObject.hp = Math.max(0, enemy.gameObject.hp - this.damage);
      });
    }
  }
}
