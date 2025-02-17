import Game from './game';
import BasicDefender from 'game/entities/defenders/basic_defender.ts';

type TProps = {
  game: Game;
};

export default class GameplayController {
  game: Game;
  shouldAddTurret: boolean;

  constructor({ game }: TProps) {
    this.game = game;
    this.shouldAddTurret = false;
    // this.handleClick = this.handleClick.bind(this);
    // this.handleMove = this.handleMove.bind(this);
  }

  handleClick(x: number, y: number) {
    if (this.shouldAddTurret) {
      this.handleAddTurret(x, y);
    } else {
      console.log('CLICK BUT NOTHING');
    }
  }

  handleMove(x: number, y: number) {
    // Transform x and y into grid numbers
    const gridSize = 40; // Each grid cell is 40 pixels wide
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);

    if (this.game.projection) {
      this.game.projection.gameObject.position = {
        x: gridX * 40,
        y: gridY * 40,
      };
      // @ts-ignore
      this.game.projection.placeholderPosition = [gridX, gridY];
    }
  }

  requestAddTurret() {
    this.shouldAddTurret = true;
    this.game.projection = new BasicDefender({
      game: this.game,
      placeholderPosition: [-100, -100],
      isProjection: true,
    });
  }

  handleAddTurret(x: number, y: number) {
    this.cancelAddTurretRequest();
    const gridSize = 40; // Each grid cell is 40 pixels wide
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);
    if (
      !this.game.arena.loadedTrack.find(
        (tile) => tile[0] === gridX && tile[1] === gridY,
      )
    ) {
      this.game.gameObjects.push(
        new BasicDefender({
          game: this.game,
          placeholderPosition: [gridX, gridY],
        }),
      );
    }
  }

  cancelAddTurretRequest() {
    this.shouldAddTurret = false;
    this.game.projection = null;
  }

  update(_deltaTime: number) {}

  draw(_context: any) {}
}
