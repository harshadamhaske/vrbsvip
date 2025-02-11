import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSRFinished: true,
  isSRStarted: false,
  SR_Result : []
};

export const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setSRFinished: (state, action) => {
      state.isSRFinished = action.payload;
    },
    setSRStarted: (state, action) => {
      state.isSRStarted = action.payload;
    },
    setSRResult: (state, action) => {
      state.SR_Result = action.payload;
    }
  },
});

export const {
  setSRFinished,
  setSRStarted,
  setSRResult
} = voiceSlice.actions;

export default voiceSlice.reducer;
