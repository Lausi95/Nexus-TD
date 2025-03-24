import Game from './Game.ts';
import BasicDefender from 'game/entities/defenders/basic_defender.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { getGridXY, isCoordinateInTile } from 'utils/gridUtils.ts';
import { COLOR } from 'game/enum/colors.ts';
import store from 'redux/store.ts';
import { setInspectedDefender } from 'redux/slices/gameSlice.ts';
import { DEFENDERS } from 'game/enum/defenders.ts';
import FlamethrowerDefener from 'game/entities/defenders/flamethrower_defender.ts';

type TProps = {
  game: Game;
};

export default class GameplayController {
  game: Game;
  shouldAddTurret: boolean;
  selectedTurret: DefenderObject | null;

  constructor({ game }: TProps) {
    this.game = game;
    this.shouldAddTurret = false;
    this.selectedTurret = null;
    // this.handleClick = this.handleClick.bind(this);
    // this.handleMove = this.handleMove.bind(this);
  }

  handleClick(x: number, y: number) {
    if (this.shouldAddTurret) {
      this.handleAddTurret(x, y);
    } else {
      const foundTurret = this.game.defenderObjects.find((obj) =>
        isCoordinateInTile(obj.gameObject.placeholderPosition, x, y),
      );
      if (foundTurret) {
        this.selectedTurret = foundTurret;
        store.dispatch(setInspectedDefender(foundTurret.getInspectDetails()));
      } else {
        this.selectedTurret = null;
        store.dispatch(setInspectedDefender(null));
      }
    }
  }

  handleMove(x: number, y: number) {
    // Transform x and y into grid numbers
    const gridSize = 40; // Each grid cell is 40 pixels wide
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);

    // Handle Projection
    if (this.game.projection) {
      this.game.projection.gameObject.position = {
        x: gridX * 40,
        y: gridY * 40,
      };
      // @ts-ignore
      this.game.projection.gameObject.placeholderPosition = [gridX, gridY];
    }
  }

  startLevel(level: number) {
    this.game.start(level);
  }

  resetLevel() {
    this.game.reset();
  }

  requestAddTurret(defender: DEFENDERS = DEFENDERS.BASIC) {
    this.shouldAddTurret = true;
    this.selectedTurret = null;
    if (defender === DEFENDERS.BASIC) {
      this.game.projection = new BasicDefender({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    } else if (defender === DEFENDERS.FLAMETHROWER) {
      this.game.projection = new FlamethrowerDefener({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    }
  }

  handleAddTurret(x: number, y: number) {
    const gridXY = getGridXY(x, y);
    if (
      !this.game.arena.loadedTrack.find(
        (tile) => tile[0] === gridXY[0] && tile[1] === gridXY[1],
      )
    ) {
      if (this.game.projection instanceof BasicDefender) {
        this.game.defenderObjects.push(
          new BasicDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof FlamethrowerDefener) {
        this.game.defenderObjects.push(
          new FlamethrowerDefener({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      }
    }
    this.cancelAddTurretRequest();
  }

  cancelAddTurretRequest() {
    this.shouldAddTurret = false;
    this.game.projection = null;
  }

  update(_deltaTime: number) {}

  draw(context: any) {
    if (this.selectedTurret) {
      console.log('hello?');
      // @ts-ignore
      this.selectedTurret.drawProjection(context, COLOR.PRIMARY);
    }
  }
}
