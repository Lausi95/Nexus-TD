import Game from './Game.ts';

type InputHandlerProps = {
  game: Game;
};

const keyDownEvents = (event: any, game: Game) => {
  switch (event.code) {
    case 'Space':
      game.togglePause();
      break;
    case 'Escape':
      game.togglePause();
      break;
  }
};

const keyUpEvents = (_event: any, _game: Game) => {
  // switch (event.code) {
  // }
};

const handleClick = (event: MouseEvent, canvas: any, game: Game) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  console.log(`Click detected at: (${x}, ${y})`);
  game.gameplayController.handleClick(x, y);
};

const handleMove = (event: MouseEvent, canvas: any, game: Game) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // console.log(`Move detected at: (${x}, ${y})`);
  game.gameplayController.handleMove(x, y);
};

export default class InputHandler {
  game: Game;
  constructor({ game }: InputHandlerProps) {
    this.game = game;

    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
  }

  clickHandler(event: MouseEvent) {
    const canvas = document.getElementById('gameScreen-canvas');
    handleClick(event, canvas, this.game);
  }

  moveHandler(event: MouseEvent) {
    const canvas = document.getElementById('gameScreen-canvas');
    handleMove(event, canvas, this.game);
  }

  keyUpHandler(event: any) {
    keyUpEvents(event, this.game);
  }

  keyDownHandler(event: any) {
    keyDownEvents(event, this.game);
  }

  initEvents() {
    this.terminate();
    document.addEventListener('keydown', this.keyDownHandler);
    document.addEventListener('keyup', this.keyUpHandler);

    const canvas = document.getElementById('gameScreen-canvas');
    canvas?.addEventListener('click', this.clickHandler);
    canvas?.addEventListener('mousemove', this.moveHandler);
  }

  terminate() {
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);

    const canvas = document.getElementById('gameScreen-canvas');
    canvas?.removeEventListener('click', this.clickHandler);
  }
}
