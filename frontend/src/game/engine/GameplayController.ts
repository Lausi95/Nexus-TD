import Game from './Game.ts';
import BasicDefender from 'game/entities/defenders/basic_defender.ts';
import DefenderObject from 'game/engine/DefenderObject.ts';
import { getGridXY, isCoordinateInTile } from 'utils/gridUtils.ts';
import { COLOR } from 'game/enum/colors.ts';

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
      const foundTurret = this.game.gameObjects.find((obj) =>
        isCoordinateInTile(obj.gameObject.placeholderPosition, x, y),
      );
      if (foundTurret) {
        this.selectedTurret = foundTurret;
      } else {
        this.selectedTurret = null;
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

  requestAddTurret() {
    this.shouldAddTurret = true;
    this.selectedTurret = null;
    this.game.projection = new BasicDefender({
      game: this.game,
      placeholderPosition: [-100, -100],
      isProjection: true,
    });
  }

  handleAddTurret(x: number, y: number) {
    this.cancelAddTurretRequest();
    const gridXY = getGridXY(x, y);
    if (
      !this.game.arena.loadedTrack.find(
        (tile) => tile[0] === gridXY[0] && tile[1] === gridXY[1],
      )
    ) {
      this.game.gameObjects.push(
        new BasicDefender({
          game: this.game,
          placeholderPosition: gridXY,
        }),
      );
    }
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
