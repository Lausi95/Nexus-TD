import Game from './Game.ts';
import BasicDefender from 'game/entities/defenders/basic_defender.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { getGridXY, isCoordinateInTile } from 'utils/gridUtils.ts';
import store from 'redux/store.ts';
import { setInspectedDefender } from 'redux/slices/gameSlice.ts';
import { DEFENDERS } from 'game/enum/defenders.ts';
import FireDefender from 'game/entities/defenders/fire_defender.ts';
import NatureDefender from 'game/entities/defenders/nature_defender.ts';
import ElectricDefender from 'game/entities/defenders/electric_defender.ts';
import IceDefender from 'game/entities/defenders/ice_defender.ts';
import PlasmaDefender from 'game/entities/defenders/plasma_defender.ts';
import StoneDefender from 'game/entities/defenders/stone_defender.ts';

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

  reset() {
    this.shouldAddTurret = false;
    this.selectedTurret = null;
  }

  handleClick(x: number, y: number) {
    if (this.shouldAddTurret) {
      this.handleAddTurret(x, y);
    } else {
      let foundTurret = this.game.defenderObjects.find((obj) =>
        isCoordinateInTile(obj.gameObject.placeholderPosition, x, y),
      );
      if (
        !foundTurret &&
        isCoordinateInTile(this.game.nexus.gameObject.placeholderPosition, x, y)
      ) {
        foundTurret = this.game.nexus;
      }
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
      this.game.projection.gameObject.placeholderPosition = [gridX, gridY];
    }
  }

  startLevel(level: number) {
    this.game.start(level);
  }

  sendWave() {
    this.game.spawner.nextWave();
  }

  resetLevel() {
    this.game.emptyReset();
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
    } else if (defender === DEFENDERS.FIRE) {
      this.game.projection = new FireDefender({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    } else if (defender === DEFENDERS.NATURE) {
      this.game.projection = new NatureDefender({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    } else if (defender === DEFENDERS.ELECTRIC) {
      this.game.projection = new ElectricDefender({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    } else if (defender === DEFENDERS.ICE) {
      this.game.projection = new IceDefender({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    } else if (defender === DEFENDERS.PLASMA) {
      this.game.projection = new PlasmaDefender({
        game: this.game,
        placeholderPosition: [-100, -100],
        isProjection: true,
      });
    } else if (defender === DEFENDERS.STONE) {
      this.game.projection = new StoneDefender({
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
      ) &&
      !this.game.defenderObjects.find(
        (defender) =>
          defender.gameObject.placeholderPosition[0] === gridXY[0] &&
          defender.gameObject.placeholderPosition[1] === gridXY[1],
      )
    ) {
      if (this.game.projection instanceof BasicDefender) {
        this.game.defenderObjects.push(
          new BasicDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof FireDefender) {
        this.game.defenderObjects.push(
          new FireDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof StoneDefender) {
        this.game.defenderObjects.push(
          new StoneDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof ElectricDefender) {
        this.game.defenderObjects.push(
          new ElectricDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof IceDefender) {
        this.game.defenderObjects.push(
          new IceDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof PlasmaDefender) {
        this.game.defenderObjects.push(
          new PlasmaDefender({
            game: this.game,
            placeholderPosition: gridXY,
          }),
        );
      } else if (this.game.projection instanceof NatureDefender) {
        this.game.defenderObjects.push(
          new NatureDefender({
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
      this.selectedTurret.drawProjection(context, true);
    }
  }
}
