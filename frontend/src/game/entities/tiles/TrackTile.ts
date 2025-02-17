import { TILE_TYPE } from 'game/enum/tile_type.ts';
import TileObject from 'game/entities/tiles/Tile.ts';

type TProps = {
  gridPosition: { x: number; y: number };
};

export default class TrackTile extends TileObject {
  constructor({ gridPosition }: TProps) {
    super({
      type: TILE_TYPE.TRACK,
      gridPosition,
    });
  }

  update(_deltaTime: number): void {}
  draw(context: any): void {
    context.strokeStyle = 'yellow';
    context.beginPath();
    context.rect(this.gridPosition.x * 40, this.gridPosition.y * 40, 40, 40);
    context.stroke();
  }
  // getBounds(): Rectangle {return };
}
