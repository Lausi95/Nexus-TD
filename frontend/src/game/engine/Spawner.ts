import Game from './Game.ts';
import store from '../../redux/store';
import { getSec, sec } from 'utils/deltaTime.ts';
import { setCurrentTimer } from 'redux/slices/gameSlice.ts';
import { getLevel0 } from './levels/getLevel0';

type SpawnerProps = {
  game: Game;
};

export default class Spawner {
  game: Game;
  executionSequence: number;
  roundTimer: number;
  chaosRoundTimer: number;
  timerInterval: number;
  constructor({ game }: SpawnerProps) {
    this.game = game;

    this.executionSequence = 0;
    this.roundTimer = 0; // Through calculations 1 sec of real Time is about roundTimer = 60
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
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
    // hud.reset():
  }

  updateHudProgress() {}

  update(_deltaTime: number) {
    this.roundTimer++;

    this.timerInterval++;
    if (this.timerInterval >= 5) {
      this.timerInterval = 0;
      store.dispatch(setCurrentTimer(getSec(this.roundTimer, 2)));
    }
    if (this.game.level === 0) {
      getLevel0(this.game);
    }
  }
}
