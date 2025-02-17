import { TILE_TYPE } from 'game/enum/tile_type.ts';

type TProps = {
  type: TILE_TYPE;
  gridPosition: { x: number; y: number };
};

export default abstract class TileObject {
  type: TILE_TYPE;
  gridPosition: { x: number; y: number };
  constructor({ type, gridPosition }: TProps) {
    this.type = type;
    this.gridPosition = gridPosition;
  }

  abstract update(deltaTime: number): void;
  abstract draw(g: any): void;
  // abstract getBounds(): Rectangle;
}
