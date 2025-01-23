import InputHandler from './input';
import { GAME_STATE } from '../enum/game_state';
import { ENTITY_ID } from '../enum/entitiy_id';
import GameObject from './gameObject';
//import Menu from "./menu";
import Hud from './hud';
import Spawner from './spawner';
// import { setGameState } from 'redux/slices/gameSlice';
import store from '../../redux/store';
import { Relic } from '../types/Relic.ts';
import { COLOR } from '../enum/colors.ts';
import { getMinMax } from 'utils/getMinMax.ts';

type GameProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default class Game {
  level: number;
  dev: boolean;
  gameObjects: GameObject[];
  // particleObjects: Trail[];
  canvas: GameProps;
  gameState: GAME_STATE;
  now: number;
  spawner: Spawner;
  hud: Hud;
  inputHandler: InputHandler;
  birthday: number;
  timeScale: number; // 1 means normal, 2 means half the speed etc
  keyLastTimePressed: number;
  updateTimeCounter: number;

  constructor({ canvasHeight, canvasWidth }: GameProps) {
    console.log('⚽️ GAME ENGINE CREATED');
    this.canvas = { canvasHeight, canvasWidth };
    this.birthday = Date.now();
    // experimental level;

    this.level = 1;
    // Dev option for debugging
    this.dev = true; // process.env.NODE_ENV === 'development';
    /**
     * gameObjects -> Player can interact with (Player excluded)
     * particleObject -> Player usually cannot interact with
     */
    this.gameObjects = [];

    // this.particleObjects = [];

    this.gameState = GAME_STATE.CLOSED;

    this.spawner = new Spawner({ game: this });
    //this.menu = new Menu(this, this.spawner);
    this.hud = new Hud({ game: this });
    this.now = Date.now();

    // TESTING
    // this.menu.playGame(this.level);

    this.inputHandler = new InputHandler({ game: this });
    this.inputHandler.initEvents();
    this.timeScale = 1;
    this.keyLastTimePressed = this.now;
    this.updateTimeCounter = 0;
  }

  //This function runs once per reload of the page
  start(level: number, relic: Relic | null) {
    // Cleaning up any leftovers
    this.emptyReset();
    console.log('⛳️ LEVEL STARTED', level, relic);
    this.togglePause(GAME_STATE.PLAYING);
    this.level = level;
    this.spawner.startLevel(this.level);
  }

  setGameState(gameState: GAME_STATE) {
    this.gameState = gameState;
    // store.dispatch(setGameState(this.gameState));
  }

  close() {
    this.gameObjects = [];
    // this.particleObjects = [];
    // this.gameState = GAME_STATE.CLOSED;
    this.setGameState(GAME_STATE.CLOSED);
  }

  reset() {
    //This is the reset/replay button
    this.emptyReset();
    this.togglePause(GAME_STATE.PLAYING);
    this.spawner.startLevel(this.level);
  }

  emptyReset() {
    // Resting all the variables
    this.gameObjects = [];
    // this.particleObjects = [];
    this.spawner.reset();
  }

  clearEnemies() {
    for (let i = 0; i < this.gameObjects.length; i++) {
      if (
        this.gameObjects[i].gameObject.id === ENTITY_ID.BASIC_ENEMY ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.VENOM ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.SHADOW_AURA ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.MAGNET_AURA_MINUS ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.MAGNET_AURA_MINUS ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.INFERNO_WALL ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.SNOWFLAKE ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.FROSTY ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.HACKER ||
        this.gameObjects[i].gameObject.id === ENTITY_ID.REAPER
      ) {
        this.gameObjects.splice(i, 1);
        i--;
      }
    }
  }

  dispatchGameState(gameState: GAME_STATE) {
    this.gameState = gameState;
    // store.dispatch(setGameState(this.gameState));
  }


  dispatchVictory(_stars: number) {
    this.setGameState(GAME_STATE.PAGE_VICTORY);
  }

  dispatchDefeat(_stars: number) {
    this.setGameState(GAME_STATE.PAGE_DEFEAT);
  }

  togglePause(optionalState?: GAME_STATE) {
    if (optionalState) {
      this.gameState = optionalState;
    } else if (this.gameState === GAME_STATE.PAUSED) {
      this.gameState = GAME_STATE.PLAYING;
    } else if (this.gameState === GAME_STATE.PLAYING) {
      this.gameState = GAME_STATE.PAUSED;
    }
    // store.dispatch(setGameState(this.gameState));
  }

  keyPressed() {
    this.keyLastTimePressed = this.now;
  }

  update(deltaTime: number) {
    if (this.gameState === GAME_STATE.PLAYING) {
      this.now = Date.now();


      if (this.updateTimeCounter % this.timeScale === 0) {
        // this.particleObjects.forEach((object) => object.update(deltaTime));
        this.gameObjects.forEach((object) => object.update(deltaTime));
      }

      this.updateTimeCounter++;
      this.spawner.update(deltaTime);
      this.hud.update(deltaTime);
    }
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.gameObjects.find((obj) => obj.gameObject.id === ENTITY_ID.SHADOW_BOSS)) {
      const gradient = context.createLinearGradient(0, 20, 0, this.canvas.canvasHeight);

      gradient.addColorStop(0, COLOR.BLACK + '00');
      gradient.addColorStop(0.1, COLOR.BLACK + '70');
      gradient.addColorStop(0.8, COLOR.BLACK);
      gradient.addColorStop(1, COLOR.BLACK);

      // Use the gradient to fill the rectangle
      context.fillStyle = gradient;
      context.fillRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
    }

}
}
