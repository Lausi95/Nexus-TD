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
import Arena from 'game/engine/arena.ts';
import BasicEnemy from 'game/entities/attackers/basic_enemy.ts';
import BasicDefender from 'game/entities/defenders/basic_defender.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';
import GameplayController from 'game/engine/gameplayController.ts';

type GameProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default class Game {
  level: number;
  dev: boolean;
  gameObjects: GameObject[];
  attackerObjects: AttackerObject[];
  projection: GameObject | null;
  // defenderObjects:
  // particleObjects: Trail[];
  canvas: GameProps;
  gameState: GAME_STATE;
  now: number;
  spawner: Spawner;
  hud: Hud;
  arena: Arena;
  inputHandler: InputHandler;
  gameplayController: GameplayController;
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
    this.attackerObjects = [];
    this.projection = null;

    // this.particleObjects = [];

    this.gameState = GAME_STATE.CLOSED;

    this.spawner = new Spawner({ game: this });
    //this.menu = new Menu(this, this.spawner);
    this.hud = new Hud({ game: this });
    this.arena = new Arena({ game: this });
    this.gameplayController = new GameplayController({ game: this });
    this.now = Date.now();

    // TESTING
    // this.menu.playGame(this.level);

    this.inputHandler = new InputHandler({ game: this });
    this.timeScale = 1;
    this.keyLastTimePressed = this.now;
    this.updateTimeCounter = 0;
  }

  //This function runs once per reload of the page
  start(level: number) {
    // Cleaning up any leftovers
    this.emptyReset();
    console.log('⛳️ LEVEL STARTED', level);
    this.togglePause(GAME_STATE.PLAYING);
    this.level = level;
    this.spawner.startLevel(this.level);
    this.inputHandler.initEvents();
  }

  setGameState(gameState: GAME_STATE) {
    this.gameState = gameState;
    // store.dispatch(setGameState(this.gameState));
  }

  close() {
    this.gameObjects = [];
    this.attackerObjects = [];
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
    this.gameObjects = [
      // new BasicDefender({ game: this, placeholderPosition: [7, 4] }),
      //new BasicDefender({ game: this, placeholderPosition: [10, 6] }),
      //new BasicDefender({ game: this, placeholderPosition: [4, 7] }),
    ];
    this.attackerObjects = [];
    // this.particleObjects = [];
    this.spawner.reset();
  }

  clearEnemies() {
    for (let i = 0; i < this.attackerObjects.length; i++) {
      this.attackerObjects.splice(i, 1);
      i--;
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
        this.attackerObjects.forEach((object) => object.update(deltaTime));
      }

      this.updateTimeCounter++;
      this.spawner.update(deltaTime);
      this.arena.update(deltaTime);
      this.hud.update(deltaTime);
      // if(this.projection){
      //   this.projection.update(deltaTime)
      // }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    // this.particleObjects.forEach((object) => object.draw(context));
    // this.playerParticleObjects.forEach((object) => object.draw(context));
    this.arena.draw(context);
    this.gameObjects.forEach((object) => object.draw(context));
    this.attackerObjects.forEach((object) => object.draw(context));
    this.hud.draw(context);
    if (this.projection) {
      this.projection.draw(context);
    }
  }
}
