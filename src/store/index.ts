import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import dialogReducer from './dialogSlice';
import toastReducer from './toastSlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    entries: entryReducer,
    dialogs: dialogReducer,
    toasts: toastReducer,
    theme: themeReducer,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export default store;
