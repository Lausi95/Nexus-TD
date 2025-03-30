import Game from './engine/Game.ts';
import { GAME_STATE } from './enum/game_state';

let context: CanvasRenderingContext2D | null = null;

export const setContext = (newContext: any) => {
  context = newContext;
};

const startEngine = () => {
  const canvas = <HTMLCanvasElement>(
    document.getElementById('gameScreen-canvas')
  );

  if (canvas) {
    context = canvas.getContext('2d');
  }

  const GAME_WIDTH = 900;
  const GAME_HEIGHT = 500;

  // Initiating our game engine and run it.
  // We pass default values for canvasWidth and canvasHeight since we initialize the Game at App level
  // But we have to pass the actual canvas size at game.Start just to make sure
  const game = new Game({ canvasWidth: GAME_WIDTH, canvasHeight: GAME_HEIGHT });

  let lastTime = 0;
  const fps = 60;
  const fpsInterval = 1000 / fps;

  function gameLoop(timestamp: number) {
    if (!lastTime) lastTime = timestamp;

    const deltaTime = timestamp - lastTime;

    if (game.gameState === GAME_STATE.PLAYING && context !== null) {
      if (deltaTime >= fpsInterval) {
        // Update Logic and Redraw
        game.update(deltaTime);
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        game.draw(context);

        // Set lastTime to current frame (not corrected by leftover)
        lastTime = timestamp;
      }
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  return game;
};

export default startEngine;
