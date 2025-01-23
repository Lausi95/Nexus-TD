import Game from './game';
import store from '../../redux/store';
import { getSec, sec } from '../../utils/deltaTime';
import {  setCurrentTimer } from '../../redux/slices/gameSlice';
import { getLevel0, level0Stars } from './levels/getLevel0';


type SpawnerProps = {
  game: Game;
};

export default class Spawner {
  game: Game;
  executionSequence: number;
  roundTimer: number;
  chaosRoundTimer: number;
  levelStars: number[][];
  timerInterval: number;
  constructor({ game }: SpawnerProps) {
    this.game = game;

    this.executionSequence = 0;
    this.roundTimer = 0; // Through calculations 1 sec of real Time is about roundTimer = 60
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
    this.levelStars = [
      level0Stars,
    ];
  }

  reset() {
    this.executionSequence = 0; // 3, after the star
    this.roundTimer = sec(0);
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
  }

  startLevel(_level: number) {
    this.updateHudProgress();
    this.reset();
    //hud.reset():
  }

  updateHudProgress() {
  }

  update(_deltaTime: number) {
    this.roundTimer++;

    this.timerInterval++;
    if (this.timerInterval >= 5) {
      this.timerInterval = 0;
      store.dispatch(setCurrentTimer(getSec(this.roundTimer, 2)));
    }

    if (this.game.player.milestone) {
      this.executionSequence++;
      this.game.player.milestone = false;
    }
    if (this.game.level === 0) {
      getLevel0(this.game);
    }
  }
}
