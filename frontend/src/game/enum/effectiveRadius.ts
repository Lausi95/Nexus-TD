import { EffectiveRadius } from 'game/types/EffectiveRadius.ts';

export const radiusSquare1x: EffectiveRadius = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
export const radiusSquare2x: EffectiveRadius = [
  ...radiusSquare1x,
  [-2, -2],
  [-1, -2],
  [0, -2],
  [1, -2],
  [2, -2],
  [2, -1],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [0, 2],
  [-1, 2],
  [-2, 2],
  [-2, 1],
  [-2, 0],
  [-2, -1],
];

export const radiusCross1x: EffectiveRadius = [
  [0, 0],
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
export const radiusCross2x: EffectiveRadius = [
  ...radiusCross1x,
  [2, 0],
  [0, 2],
  [-2, 0],
  [0, -2],
];
