import { TILE_TYPE } from 'game/enum/tile_type.ts';
import TileObject from 'game/entities/tiles/Tile.ts';
import { COLOR } from 'game/enum/colors.ts';
import { XY } from 'game/types/XY.ts';
import { TILE_SIZE } from 'game/constants';

type TProps = {
  gridPosition: XY;
  track?: [number, number][];
  index?: number;
};

export default class TrackTile extends TileObject {
  private track?: [number, number][];
  private index?: number;

  constructor({ gridPosition, track, index }: TProps) {
    super({
      type: TILE_TYPE.TRACK,
      gridPosition,
    });
    this.track = track;
    this.index = index;
  }

  update(_deltaTime: number): void {}
  draw(context: CanvasRenderingContext2D): void {
    const size = TILE_SIZE;
    const x = this.gridPosition.x * size;
    const y = this.gridPosition.y * size;

    let prev: XY | undefined = undefined;
    let next: XY | undefined = undefined;

    if (this.track && this.index !== undefined) {
      if (this.index > 0) {
        const [px, py] = this.track[this.index - 1];
        prev = { x: px, y: py };
      }
      if (this.index < this.track.length - 1) {
        const [nx, ny] = this.track[this.index + 1];
        next = { x: nx, y: ny };
      }
    }

    const neighbors: XY[] = [prev, next].filter(Boolean) as XY[];

    const hasNeighborAt = (dx: number, dy: number): boolean => {
      if (neighbors.length === 0) return false;

      return neighbors.some(
        (pos) =>
          pos.x === this.gridPosition.x + dx &&
          pos.y === this.gridPosition.y + dy,
      );
    };

    context.lineWidth = 2;
    context.strokeStyle = COLOR.PRIMARY;
    context.beginPath();

    // Top
    if (!hasNeighborAt(0, -1)) {
      context.moveTo(x, y);
      context.lineTo(x + size, y);
    }

    // Right
    if (!hasNeighborAt(1, 0)) {
      context.moveTo(x + size, y);
      context.lineTo(x + size, y + size);
    }

    // Bottom
    if (!hasNeighborAt(0, 1)) {
      context.moveTo(x + size, y + size);
      context.lineTo(x, y + size);
    }

    // Left
    if (!hasNeighborAt(-1, 0)) {
      context.moveTo(x, y + size);
      context.lineTo(x, y);
    }

    context.stroke();
    context.lineWidth = 1;
  }
}
