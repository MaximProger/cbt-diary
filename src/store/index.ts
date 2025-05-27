import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import dialogReducer from './dialogSlice';

export default configureStore({
  reducer: {
    entries: entryReducer,
    dialogs: dialogReducer,
  },
});
