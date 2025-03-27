import Game from './Game.ts';
import store from '../../redux/store';
import { getSec, sec } from 'utils/deltaTime.ts';
import { setCurrentTimer } from 'redux/slices/gameSlice.ts';
import { level0Waves } from './levels/0';

type SpawnerProps = {
  game: Game;
};

export default class Spawner {
  game: Game;
  executionSequence: number;
  roundTimer: number;
  chaosRoundTimer: number;
  timerInterval: number;
  wave: null | number;
  constructor({ game }: SpawnerProps) {
    this.game = game;

    this.executionSequence = 0;
    this.roundTimer = 0; // Through calculations 1 sec of real Time is about roundTimer = 60
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
    this.wave = null;
  }

  reset(wave?: null | number) {
    this.executionSequence = 0; // 3, after the star
    this.roundTimer = sec(0);
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
    this.wave = wave === undefined ? null : wave;
  }

  startWave(wave: number) {
    this.reset(wave);
  }

  nextWave() {
    const nextWave = this.wave ? this.wave + 1 : 0;
    this.reset(nextWave);
  }

  resetWave() {
    this.reset(this.wave);
  }

  update(_deltaTime: number) {
    this.roundTimer++;

    this.timerInterval++;
    if (this.timerInterval >= 5) {
      this.timerInterval = 0;
      store.dispatch(setCurrentTimer(getSec(this.roundTimer, 2)));
    }

    if (this.game.level === 0) {
      const maxWave = level0Waves.length;
      if (this.wave !== null && this.wave < maxWave) {
        level0Waves[this.wave](this.game);
      }
    }
  }
}
