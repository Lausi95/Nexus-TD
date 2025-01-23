import { createSlice } from '@reduxjs/toolkit';
import Game from '../../game/engine/game';

type gameSliceType = {
  game: Game | null;
  hp: number;
  currentTimer: number;
};

const initialState: gameSliceType = {
  game: null,
  hp: 0,
  currentTimer: 0,
};

const gameSlice = createSlice({
  name: 'gameData',
  initialState,

  reducers: {
    reset: (state) => {
      state.hp = 0;
    },
    setHP: (state, action) => {
      state.hp = action.payload;
    },


    setCurrentTimer: (state, action) => {
      state.currentTimer = action.payload;
    },

    resetTimers: (state) => {
      state.currentTimer = 0;
    },
  },
});

export const {
  setHP,
  reset,
  setCurrentTimer,
  resetTimers,
} = gameSlice.actions;

export default gameSlice.reducer;
