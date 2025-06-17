import dialogReducer, { openDialog, closeDialog, initialState, type IInitialState } from '../dialogSlice';

describe('dialogReducer', () => {
  it('should return default state when passed an empty action', () => {
    const result = dialogReducer(initialState, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should open dialog with "openDialog" action', () => {
    const action = { type: openDialog.type, payload: 'isOpenAddDialog' };
    const result = dialogReducer(initialState, action);
    expect(result.isOpenAddDialog).toBeTruthy();
  });

  it('should close dialog with "closeDialog" action', () => {
    const stateWithOpenAddDialog: IInitialState = {
      ...initialState,
      isOpenAddDialog: true,
    };
    const action = { type: closeDialog.type, payload: 'isOpenAddDialog' };
    const result = dialogReducer(stateWithOpenAddDialog, action);
    expect(result.isOpenAddDialog).toBeFalsy();
  });
});
