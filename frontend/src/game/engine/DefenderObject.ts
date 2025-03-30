import { ENTITY_ID } from '../enum/entitiy_id';
import Game from 'game/engine/Game.ts';
import { DefenderInspectionDetails } from 'game/types/InspectionDetails.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';
import { drawAttackArea, isEnemyInAttackRange } from 'utils/targetDetection.ts';
import { radiusSquare1x } from 'game/enum/effectiveRadius.ts';
import { EffectiveRadius } from 'game/types/EffectiveRadius.ts';
import { COLOR } from 'game/enum/colors.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import { getElementalDamage } from 'utils/getElementalDamage.ts';

type TProps = {
  game: Game;
  id: ENTITY_ID;
  elementType: ELEMENT_TYPE;
  name: string;
  position: { x: number; y: number };
  placeholderPosition: [number, number];
  maxTargets: number;
  attackSpeed: number;
  damage: number;
  cost: number;
  isProjection: boolean;
  effectiveRadius: EffectiveRadius;
};

type OptionalKeys =
  | 'name'
  | 'maxTargets'
  | 'position'
  | 'attackSpeed'
  | 'damage'
  | 'cost'
  | 'effectiveRadius';

type ConstructorProps = Omit<TProps, OptionalKeys> & {
  name?: string;
  maxTargets?: number;
  attackSpeed?: number;
  damage?: number;
  cost?: number;
  position?: { x: number; y: number };
  effectiveRadius?: EffectiveRadius;
};

export default abstract class DefenderObject {
  gameObject: TProps;
  enemiesTargeted: AttackerObject[];
  lastAttackTimestamp: number;
  protected constructor(props: ConstructorProps) {
    this.gameObject = {
      ...props,
      position: {
        x: props.placeholderPosition[0] * 40,
        y: props.placeholderPosition[1] * 40,
      },
      name: props.name ?? 'DEFAULT TURRET',
      maxTargets: props.maxTargets ?? 100,
      attackSpeed: props.attackSpeed ?? 3,
      damage: props.damage ?? 10,
      cost: props.cost ?? 10,
      effectiveRadius: props.effectiveRadius ?? radiusSquare1x,
    };
    this.enemiesTargeted = [];
    this.lastAttackTimestamp = 0;
  }

  abstract update(deltaTime: number): void;
  abstract draw(context: any): void;

  drawProjection(context: CanvasRenderingContext2D, ignoreCheck?: boolean) {
    let colorHighlight = COLOR.PRIMARY;

    if (
      !ignoreCheck &&
      (this.gameObject.game.arena.loadedTrack.find(
        (tile) =>
          tile[0] === this.gameObject.placeholderPosition[0] &&
          tile[1] === this.gameObject.placeholderPosition[1],
      ) ||
        (this.gameObject.isProjection &&
          this.gameObject.game.defenderObjects.find(
            (defender) =>
              defender.gameObject.placeholderPosition[0] ===
                this.gameObject.placeholderPosition[0] &&
              defender.gameObject.placeholderPosition[1] ===
                this.gameObject.placeholderPosition[1],
          )))
    ) {
      colorHighlight = COLOR.RED;
    }
    drawAttackArea(
      this.gameObject.effectiveRadius,
      [this.gameObject.position.x, this.gameObject.position.y],
      context,
      colorHighlight + '20',
    );
    context.lineWidth = 2;
    context.strokeStyle = COLOR.WHITE;
    context.strokeRect(
      this.gameObject.position.x + 10,
      this.gameObject.position.y + 10,
      20,
      20,
    );
    context.lineWidth = 1;
  }

  drawTargetTracing(
    context: CanvasRenderingContext2D,
    color: string = COLOR.PRIMARY,
  ) {
    context.lineWidth = 1; // Set line width
    context.strokeStyle = color;
    this.enemiesTargeted.forEach((enemy) => {
      context.beginPath();
      context.moveTo(
        this.gameObject.position.x + 20,
        this.gameObject.position.y + 20,
      );
      context.lineTo(
        enemy.gameObject.position.x + 6,
        enemy.gameObject.position.y + 6,
      );
      context.stroke();
    });
  }

  getInspectDetails(): DefenderInspectionDetails {
    return {
      name: this.gameObject.name,
      damage: this.gameObject.damage,
      attackSpeed: this.gameObject.attackSpeed,
      radius: 2,
    };
  }

  targetAndDamageEnemies() {
    // Calculate targeted enemies
    const newArray: AttackerObject[] = [];
    this.gameObject.game.attackerObjects.forEach((gameObj) => {
      if (
        newArray.length < this.gameObject.maxTargets &&
        gameObj.gameObject.id === ENTITY_ID.BASIC_ENEMY
      ) {
        if (
          isEnemyInAttackRange(
            this.gameObject.effectiveRadius,
            [this.gameObject.position.x, this.gameObject.position.y],
            [gameObj.gameObject.position.x, gameObj.gameObject.position.y],
          )
        ) {
          newArray.push(gameObj);
        }
      }
    });
    this.enemiesTargeted = newArray;

    // Deal damage to the targeted enemies
    if (
      this.gameObject.game.now >=
      this.lastAttackTimestamp + 1000 / this.gameObject.attackSpeed
    ) {
      this.lastAttackTimestamp = this.gameObject.game.now;
      this.enemiesTargeted.forEach((enemy) => {
        enemy.gameObject.hp = Math.max(
          0,
          enemy.gameObject.hp - getElementalDamage(this, enemy),
        );
      });
    }
  }
}
