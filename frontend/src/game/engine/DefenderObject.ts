import { ENTITY_ID } from '../enum/entitiy_id';
import Game from 'game/engine/Game.ts';
import { DefenderInspectionDetails } from 'game/types/InspectionDetails.ts';

type TProps = {
  id: ENTITY_ID;
  game: Game;
  position: { x: number; y: number };
  placeholderPosition: [number, number];
};

export default abstract class DefenderObject {
  gameObject: TProps;
  protected constructor({ id, game, position, placeholderPosition }: TProps) {
    this.gameObject = {
      id,
      game,
      position,
      placeholderPosition,
    };
  }

  abstract update(deltaTime: number): void;
  abstract draw(context: any): void;
  abstract getInspectDetails(): DefenderInspectionDetails;
}
