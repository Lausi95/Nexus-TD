// import { playText } from 'redux/slices/vfxSlice.ts';
import { Stars } from '../../types/Stars';
import Game from '../game';
import Star from '../../entities/star';
import {sec} from "../../../utils/deltaTime.ts";

export const level0Stars: Stars = [3, 15, 30];

export const getLevel0 = (game: Game): null => {
  if (game.spawner.executionSequence === 0) {
    if (game.spawner.roundTimer === sec(0.1)) {
      // store.dispatch(playText(['LEVEL 0', 'Dev']));
      // game.gameObjects.push(
      //   new BipolarEnemy({
      //     game,
      //     position: { x: 10, y: 40 },
      //   }),
      // );
    } else if (game.spawner.roundTimer === sec(1)) {
      game.gameObjects.push(
        new Star({
          game,
          position: { x: game.canvas.canvasWidth / 2 - 20, y: 50 },
        }),
      );
    }
  }
  return null;
};
