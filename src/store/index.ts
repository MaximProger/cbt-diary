import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import dialogReducer from './dialogSlice';
import toastReducer from './toastSlice';

const store = configureStore({
  reducer: {
    entries: entryReducer,
    dialogs: dialogReducer,
    toasts: toastReducer,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export default store;
