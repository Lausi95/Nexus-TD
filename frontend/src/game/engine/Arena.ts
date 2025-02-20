import Game from './Game.ts';
import TrackTile from 'game/entities/tiles/TrackTile.ts';
import TileObject from 'game/entities/tiles/Tile.ts';
import PlaceholderTile from 'game/entities/tiles/PlaceholderTile.ts';
import { TRACK_0 } from 'game/engine/tracks/track0.ts';

type AreaProps = {
  game: Game;
};

const getGrid = (track: [number, number][]) => {
  let grid = [];

  for (let x = 0; x < 16; x++) {
    let row = [];
    for (let y = 0; y < 10; y++) {
      const isTrackTile = track.some(([tx, ty]) => tx === x && ty === y);
      if (isTrackTile) {
        row.push(new TrackTile({ gridPosition: { x, y } }));
      } else {
        row.push(new PlaceholderTile({ gridPosition: { x, y } }));
      }
    }
    grid.push(row); // Push the row to the main array
  }
  return grid;
};

export default class Arena {
  game: Game;
  loadedTrack: [number, number][];
  grid: TileObject[][];

  constructor({ game }: AreaProps) {
    this.game = game;
    this.loadedTrack = TRACK_0;
    this.grid = getGrid(this.loadedTrack);
  }

  update(_deltaTime: number) {}

  draw(context: any) {
    for (let row of this.grid) {
      for (let obj of row) {
        obj.draw(context);
      }
    }
  }
}
