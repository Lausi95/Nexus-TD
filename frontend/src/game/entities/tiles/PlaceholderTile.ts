import { TILE_TYPE } from 'game/enum/tile_type.ts';
import TileObject from 'game/entities/tiles/Tile.ts';

type TProps = {
  gridPosition: { x: number; y: number };
};

export default class PlaceholderTile extends TileObject {
  constructor({ gridPosition }: TProps) {
    super({
      type: TILE_TYPE.PLACEHOLDER,
      gridPosition,
    });
  }

  update(_deltaTime: number): void {}
  draw(context: any): void {
    context.strokeStyle = 'white';
    context.globalAlpha = 0.06;
    context.beginPath();
    context.rect(this.gridPosition.x * 40, this.gridPosition.y * 40, 40, 40);
    context.stroke();
    context.globalAlpha = 1;
  }
  // getBounds(): Rectangle {return };
}
