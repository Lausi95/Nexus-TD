import { XY } from './XY.ts';

export type Rectangle = XY & {
  width: number;
  height: number;
};
