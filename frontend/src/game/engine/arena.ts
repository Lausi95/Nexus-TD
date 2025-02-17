import { getSec } from 'utils/deltaTime.ts';
import Game from './game';
import TrackTile from 'game/entities/tiles/TrackTile.ts';
import TileObject from 'game/entities/tiles/Tile.ts';
import PlaceholderTile from 'game/entities/tiles/PlaceholderTile.ts';

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

const TRACK_1: [number, number][] = [
  [0, 1],
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [5, 7],
  [5, 6],
  [5, 5],
  [5, 4],
  [5, 3],
  [5, 2],
  [6, 2],
  [7, 2],
  [8, 2],
  [9, 2],
  [10, 2],
  [11, 2],
  [12, 2],
  [13, 2],
  [14, 2],
  [14, 3],
  [14, 4],
  [14, 5],
  [13, 5],
  [12, 5],
  [11, 5],
  [10, 5],
  [9, 5],
  [9, 6],
  [9, 7],
  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8],
  [15, 8],
];

export default class Arena {
  game: Game;
  loadedTrack: [number, number][];
  grid: TileObject[][];

  constructor({ game }: AreaProps) {
    this.game = game;
    this.loadedTrack = TRACK_1;
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
