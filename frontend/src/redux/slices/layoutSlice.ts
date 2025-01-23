import { createSlice } from '@reduxjs/toolkit';

type layoutSliceType = {
  loading: boolean;
  errorCode: null;
  zoom: number;
};
const initialState: layoutSliceType = {
  loading: false,
  errorCode: null,
  zoom: 1,
};

const layoutSlice = createSlice({
  name: 'layoutData',
  initialState,

  reducers: {
    setLoadingRedux: (state, action) => {
      state.loading = action.payload;
    },

    consumeErrorCode: (state) => {
      state.errorCode = null;
    },

    setErrorCode: (state, action) => {
      state.errorCode = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
  },
});

export const { setLoadingRedux, consumeErrorCode, setErrorCode, setZoom } = layoutSlice.actions;

export default layoutSlice.reducer;
