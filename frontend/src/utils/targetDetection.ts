import { COLOR } from 'game/enum/colors.ts';
import { TILE_SIZE } from 'game/constants';
import { ELEMENT_TYPE } from 'game/enum/elementType.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';

type TCanvasPos = [number, number];

export const isEnemyInAttackRange = (
  offsets: number[][],
  defenderCanvasPos: TCanvasPos,
  enemyCanvasPos: TCanvasPos,
): boolean => {
  const [defenderX, defenderY] = defenderCanvasPos;
  const [enemyX, enemyY] = enemyCanvasPos;

  // Convert defender's canvas position to tile grid position
  const defenderTileX = Math.floor(defenderX / TILE_SIZE);
  const defenderTileY = Math.floor(defenderY / TILE_SIZE);

  return offsets.some(([dx, dy]) => {
    const tileX = (defenderTileX + dx) * TILE_SIZE;
    const tileY = (defenderTileY + dy) * TILE_SIZE;

    return (
      enemyX >= tileX &&
      enemyX < tileX + TILE_SIZE &&
      enemyY >= tileY &&
      enemyY < tileY + TILE_SIZE
    );
  });
};

export const drawAttackArea = (
  offsets: number[][],
  defenderCanvasPos: TCanvasPos,
  context: CanvasRenderingContext2D,
  fillStyle: string = COLOR.PRIMARY + '20',
): void => {
  const [defenderX, defenderY] = defenderCanvasPos;

  const defenderTileX = Math.floor(defenderX / TILE_SIZE);
  const defenderTileY = Math.floor(defenderY / TILE_SIZE);

  context.save(); // so we don't mess with global styles

  if (fillStyle) {
    context.fillStyle = fillStyle;
  }

  context.beginPath();

  offsets.forEach(([dx, dy]) => {
    const tileX = (defenderTileX + dx) * TILE_SIZE;
    const tileY = (defenderTileY + dy) * TILE_SIZE;

    // add rect to path
    context.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
  });
};

export type PriorityMode = 'default' | 'health' | 'preferredElement';

export const getPrioritizedAttackers = (
  attackers: AttackerObject[],
  mode: PriorityMode = 'default',
  preferredElement?: ELEMENT_TYPE,
): AttackerObject[] => {
  if (mode === 'health') {
    return [...attackers].sort((a, b) => b.gameObject.hp - a.gameObject.hp);
  }

  if (mode === 'preferredElement' && preferredElement !== undefined) {
    return [...attackers].sort((a, b) => {
      const aIsPreferred = a.gameObject.elementType === preferredElement;
      const bIsPreferred = b.gameObject.elementType === preferredElement;

      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;

      // If both match or both don't, use HP as tie-breaker
      return b.gameObject.hp - a.gameObject.hp;
    });
  }

  // Default: return in original order
  return attackers;
};
