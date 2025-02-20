import Game from './Game.ts';
import { COLOR } from 'game/enum/colors.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { ENTITY_ID } from 'game/enum/entitiy_id.ts';
import { setHP } from 'redux/slices/gameSlice.ts';
import store from 'redux/store.ts';

type TProps = {
  game: Game;
};

export default class Nexus extends DefenderObject {
  hp: number;

  constructor({ game }: TProps) {
    super({
      id: ENTITY_ID.STAR,
      game,
      position: {
        x: -100,
        y: -100,
      },
    });
    this.hp = 100;
    store.dispatch(setHP(this.hp));
  }

  reset() {
    this.hp = 100;
    this.gameObject.position = {
      x: -100,
      y: -100,
    };
  }

  update(_deltaTime: number) {
    const track = this.gameObject.game.arena.loadedTrack;
    const placeholderGrid = track[track.length - 1];
    this.gameObject.position.x = placeholderGrid[0] * 40 + 10;
    this.gameObject.position.y = placeholderGrid[1] * 40 + 10;
    const trespasser = this.gameObject.game.attackerObjects.find(
      (obj) =>
        Math.abs(obj.gameObject.position.x - this.gameObject.position.x) < 20 &&
        Math.abs(obj.gameObject.position.y - this.gameObject.position.y) < 20,
    );
    if (trespasser) {
      this.hp -= trespasser.gameObject.damage;
      store.dispatch(setHP(this.hp));
      trespasser.destruct();
    }
  }

  draw(context: any) {
    context.fillStyle = COLOR.YELLOW;
    context.fillRect(
      this.gameObject.position.x,
      this.gameObject.position.y,
      20,
      20,
    );
  }
}
