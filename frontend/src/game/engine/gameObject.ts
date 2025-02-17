import { ENTITY_ID } from '../enum/entitiy_id';
import { Rectangle } from '../types/Rectangle';

type GameObjectProps = {
  id: ENTITY_ID;
  position: { x: number; y: number };
  velocity: number;
};

export default abstract class GameObject {
  gameObject: GameObjectProps;
  constructor({ id, position, velocity }: GameObjectProps) {
    this.gameObject = {
      id,
      position,
      velocity,
    };
  }

  abstract update(deltaTime: number): void;
  abstract draw(g: any): void;
  // abstract getBounds(): Rectangle;
}
