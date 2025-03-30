import { ENTITY_ID } from '../enum/entitiy_id';
import Game from 'game/engine/Game.ts';
import TrackTile from 'game/entities/tiles/TrackTile.ts';
import store from 'redux/store.ts';
import { earnGold, earnPlatinum } from 'redux/slices/gameSlice.ts';
import { getPosition, getVelocityTilesPerSecond } from 'utils/position.ts';
import { XY } from 'game/types/XY.ts';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';

type TProps = {
  game: Game;
  id: ENTITY_ID;
  elementType: ELEMENT_TYPE;
  position: XY;
  velocity: number;
  hp: number;
  maxHp: number;
  damage: number;
  numberTrack: number;
  gold: number;
  platinum: number;
  nextTrack: TrackTile | null;
};

type OptionalKeys =
  | 'position'
  | 'velocity'
  | 'hp'
  | 'maxHp'
  | 'damage'
  | 'numberTrack'
  | 'nextTrack'
  | 'gold'
  | 'platinum';

type ConstructorProps = Omit<TProps, OptionalKeys> & {
  position?: XY;
  velocity?: number;
  hp?: number;
  maxHp?: number;
  damage?: number;
  numberTrack?: number;
  gold?: number;
  platinum?: number;
  nextTrack?: TrackTile | null;
};

export default abstract class AttackerObject {
  gameObject: TProps;
  lastTimeCheck: number;

  protected constructor(props: ConstructorProps) {
    this.gameObject = {
      ...props,
      hp: props.hp ?? 100,
      position: props.position || getPosition(props.game.arena.loadedTrack[0]),
      velocity: props.velocity ?? getVelocityTilesPerSecond(1.5),
      maxHp: props.maxHp ?? 100,
      damage: props.damage ?? 10,
      gold: props.gold ?? 10,
      platinum: props.platinum ?? 1,
      numberTrack: props.numberTrack ?? 0,
      nextTrack: props.nextTrack ?? null,
    };
    this.lastTimeCheck = props.game.now;
  }

  abstract update(deltaTime: number): void;
  abstract draw(context: any): void;

  destruct() {
    store.dispatch(earnGold(this.gameObject.gold));
    store.dispatch(earnPlatinum(this.gameObject.platinum));
    this.gameObject.game.attackerObjects.splice(
      this.gameObject.game.attackerObjects.indexOf(this),
      1,
    );
  }

  updateMovement() {
    const elapsedSeconds =
      (this.gameObject.game.now - this.lastTimeCheck) / 1000;
    this.lastTimeCheck = this.gameObject.game.now;
    const distance = elapsedSeconds * this.gameObject.velocity;

    if (this.gameObject.hp <= 0) {
      this.destruct();
    }
    const arena = this.gameObject.game.arena;
    if (this.gameObject.nextTrack === null) {
      const xy = arena.loadedTrack[this.gameObject.numberTrack];
      this.gameObject.nextTrack = arena.grid[xy[0]][xy[1]];
    }

    if (
      this.gameObject.position.x ===
        this.gameObject.nextTrack.gridPosition.x * 40 + 15 &&
      this.gameObject.position.y ===
        this.gameObject.nextTrack.gridPosition.y * 40 + 15 &&
      arena.loadedTrack.length - 1 > this.gameObject.numberTrack
    ) {
      this.gameObject.numberTrack++;
      const xy = arena.loadedTrack[this.gameObject.numberTrack];
      this.gameObject.nextTrack = arena.grid[xy[0]][xy[1]];
    }
    // Determine direction
    const directionX = Math.sign(
      this.gameObject.nextTrack.gridPosition.x * 40 +
        15 -
        this.gameObject.position.x,
    );
    const directionY = Math.sign(
      this.gameObject.nextTrack.gridPosition.y * 40 +
        15 -
        this.gameObject.position.y,
    );

    // Move positionX towards positionZ
    const newPositionX = this.gameObject.position.x + directionX * distance;
    const newPositionY = this.gameObject.position.y + directionY * distance;

    // Ensure we don't overshoot positionZ
    if (directionX > 0) {
      this.gameObject.position.x = Math.min(
        newPositionX,
        this.gameObject.nextTrack.gridPosition.x * 40 + 15,
      );
    } else {
      this.gameObject.position.x = Math.max(
        newPositionX,
        this.gameObject.nextTrack.gridPosition.x * 40 + 15,
      );
    }
    if (directionY > 0) {
      this.gameObject.position.y = Math.min(
        newPositionY,
        this.gameObject.nextTrack.gridPosition.y * 40 + 15,
      );
    } else {
      this.gameObject.position.y = Math.max(
        newPositionY,
        this.gameObject.nextTrack.gridPosition.y * 40 + 15,
      );
    }
  }
}
