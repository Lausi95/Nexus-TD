import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Game from 'game/engine/Game.ts';
import { setStatusMsg } from 'redux/slices/authSlice.ts';

export const earnPlatinum = createAsyncThunk(
  'game/earnPlatinum',
  async (amount: number, thunkAPI) => {
    try {
      return amount;
      // const { data } = await loginRequest(params.email, params.password);
      // if (data && data.token && data.data.user) {
      //   localStorage.setItem('jwt_dodge', data.token);
      //   return { accessToken: data.token, user: data.data.user };
      // } else {
      //   thunkAPI.dispatch(
      //     setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }),
      //   );
      //   return thunkAPI.rejectWithValue('');
      // }
    } catch (error: any) {
      if (error.response.data.message) {
        thunkAPI.dispatch(
          setStatusMsg({
            statusMsg: error.response.data.message,
            msgIsError: true,
          }),
        );
      } else {
        thunkAPI.dispatch(
          setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }),
        );
      }
      throw error;
    }
  },
);

type gameSliceType = {
  game: Game | null;
  hp: number;
  gold: number;
  platinum: number;
  currentTimer: number;
};

const initialState: gameSliceType = {
  game: null,
  hp: 0,
  gold: 0,
  platinum: 0,
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
    setGold: (state, action) => {
      state.gold = action.payload;
    },
    earnGold: (state, action) => {
      state.gold += action.payload;
    },
    setPlatinum: (state, action) => {
      state.platinum = action.payload;
    },
    setCurrentTimer: (state, action) => {
      state.currentTimer = action.payload;
    },
    resetTimers: (state) => {
      state.currentTimer = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(earnPlatinum.fulfilled, (state, action) => {
      state.platinum += action.payload;
    });
    builder.addCase(earnPlatinum.pending, (_state) => {});
    builder.addCase(earnPlatinum.rejected, (_state) => {});
  },
});

export const {
  setHP,
  setGold,
  earnGold,
  setPlatinum,
  reset,
  setCurrentTimer,
  resetTimers,
} = gameSlice.actions;

export default gameSlice.reducer;
