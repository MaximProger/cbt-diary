import { createSlice } from '@reduxjs/toolkit';

export interface IInitialState {
  isOpenAddDialog: boolean;
  isOpenAuthDialog: boolean;
  isOpenDeleteDialog: boolean;
  isOpenEditDialog: boolean;
  isOpenInfoDialog: boolean;
}

export const initialState: IInitialState = {
  isOpenAddDialog: false,
  isOpenAuthDialog: false,
  isOpenDeleteDialog: false,
  isOpenEditDialog: false,
  isOpenInfoDialog: false,
};

const dialogSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      const dialogName = action.payload as keyof typeof initialState;
      state[dialogName] = true;
    },
    closeDialog: (state, action) => {
      const dialogName = action.payload as keyof typeof initialState;
      state[dialogName] = false;
    },
    toggleDialog: (state, action) => {
      const dialogName = action.payload as keyof typeof initialState;
      state[dialogName] = !state[dialogName];
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
