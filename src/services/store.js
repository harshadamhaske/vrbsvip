import { configureStore } from '@reduxjs/toolkit'
import configurationsReducer from '../reducers/configurations'
import voiceReducer from '../reducers/voice'

export const store = configureStore({
  reducer: {
    configurations : configurationsReducer,
    voice : voiceReducer
  },
})