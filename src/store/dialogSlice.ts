import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenDialog: false,
};

const dialogSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isOpenDialog = true;
    },
    closeDialog: (state) => {
      state.isOpenDialog = false;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
