import { configureStore } from '@reduxjs/toolkit';
import memeReducer from './features/memeSlice';

export const store = configureStore({
  reducer: {
    meme: memeReducer,
  },
});
