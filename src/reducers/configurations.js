import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSpeechFinished: false,
  intervalID: null,
  timeoutID: null,
  language: 'en-US',
  emergencyContacts : []
};

export const counterSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {
    setSpeechFinished: (state, action) => {
      state.isSpeechFinished = action.payload;
    },
    setIntervalID: (state, action) => {
      state.intervalID = action.payload;
    },
    setTimeoutID: (state, action) => {
      state.timeoutID = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setEmergencyContacts : (state, action) => {
      state.emergencyContacts = action.payload;
    }
  },
});

export const {setSpeechFinished, setIntervalID, setLanguage, setTimeoutID, setEmergencyContacts} =
  counterSlice.actions;

export default counterSlice.reducer;
