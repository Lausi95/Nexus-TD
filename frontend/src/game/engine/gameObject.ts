import { ENTITY_ID } from '../enum/entitiy_id';
import { Rectangle } from '../types/Rectangle';

type GameObjectProps = {
  id: ENTITY_ID;
  width: number;
  height: number;
  position: { x: number; y: number };
  velX: number;
  velY: number;
  name?: string;
  symbiosisName?: string;
};

export default abstract class GameObject {
  gameObject: GameObjectProps;
  constructor({ id, width, height, position, velX, velY, name = 'Object' }: GameObjectProps) {
    this.gameObject = {
      id,
      width,
      height,
      position,
      velX,
      velY,
      name,
    };
  }

  abstract fear(x?: number, y?: number): void;
  abstract update(deltaTime: number): void;
  abstract draw(g: any): void;
  abstract getBounds(): Rectangle;
}
