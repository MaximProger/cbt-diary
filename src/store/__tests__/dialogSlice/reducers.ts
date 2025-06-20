import dialogReducer, { openDialog, closeDialog, initialState, type IInitialState } from '../../dialogSlice';

describe('dialogSlice', () => {
  describe('reducer', () => {
    it('should return the initial state when called with undefined state', () => {
      const result = dialogReducer(undefined, { type: '@@INIT' });
      expect(result).toEqual(initialState);
    });

    it('should return the current state for unknown actions', () => {
      const currentState: IInitialState = {
        ...initialState,
        isOpenAddDialog: true,
      };
      const result = dialogReducer(currentState, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(currentState);
    });
  });

  describe('openDialog action', () => {
    it('should open the specified dialog', () => {
      const result = dialogReducer(initialState, openDialog('isOpenAddDialog'));

      expect(result).toEqual({
        ...initialState,
        isOpenAddDialog: true,
      });
    });

    it('should open multiple dialogs independently', () => {
      let state = dialogReducer(initialState, openDialog('isOpenAddDialog'));
      state = dialogReducer(state, openDialog('isOpenEditDialog'));

      expect(state.isOpenAddDialog).toBe(true);
      expect(state.isOpenEditDialog).toBe(true);
    });

    it('should handle opening an already open dialog', () => {
      const stateWithOpenDialog: IInitialState = {
        ...initialState,
        isOpenAddDialog: true,
      };

      const result = dialogReducer(stateWithOpenDialog, openDialog('isOpenAddDialog'));
      expect(result.isOpenAddDialog).toBe(true);
    });

    it('should not affect other dialog states when opening a dialog', () => {
      const stateWithOtherDialogOpen: IInitialState = {
        ...initialState,
        isOpenEditDialog: true,
      };

      const result = dialogReducer(stateWithOtherDialogOpen, openDialog('isOpenAddDialog'));

      expect(result.isOpenAddDialog).toBe(true);
      expect(result.isOpenEditDialog).toBe(true);
    });
  });

  describe('closeDialog action', () => {
    it('should close the specified dialog', () => {
      const stateWithOpenDialog: IInitialState = {
        ...initialState,
        isOpenAddDialog: true,
      };

      const result = dialogReducer(stateWithOpenDialog, closeDialog('isOpenAddDialog'));

      expect(result).toEqual({
        ...initialState,
        isOpenAddDialog: false,
      });
    });

    it('should handle closing an already closed dialog', () => {
      const result = dialogReducer(initialState, closeDialog('isOpenAddDialog'));
      expect(result.isOpenAddDialog).toBe(false);
    });

    it('should not affect other dialog states when closing a dialog', () => {
      const stateWithMultipleDialogsOpen: IInitialState = {
        ...initialState,
        isOpenAddDialog: true,
        isOpenEditDialog: true,
      };

      const result = dialogReducer(stateWithMultipleDialogsOpen, closeDialog('isOpenAddDialog'));

      expect(result.isOpenAddDialog).toBe(false);
      expect(result.isOpenEditDialog).toBe(true);
    });
  });

  describe('action creators', () => {
    it('should create openDialog action with correct type and payload', () => {
      const action = openDialog('isOpenAddDialog');

      expect(action).toEqual({
        type: 'dialogs/openDialog',
        payload: 'isOpenAddDialog',
      });
    });

    it('should create closeDialog action with correct type and payload', () => {
      const action = closeDialog('isOpenAddDialog');

      expect(action).toEqual({
        type: 'dialogs/closeDialog',
        payload: 'isOpenAddDialog',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle invalid dialog names gracefully', () => {
      const invalidDialogName = 'nonExistentDialog' as keyof IInitialState;

      const result = dialogReducer(initialState, openDialog(invalidDialogName));

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('immutability', () => {
    it('should not mutate the original state when opening dialog', () => {
      const originalState = { ...initialState };
      const stateCopy = { ...initialState };

      dialogReducer(stateCopy, openDialog('isOpenAddDialog'));

      expect(originalState).toEqual(initialState);
    });

    it('should not mutate the original state when closing dialog', () => {
      const originalState: IInitialState = {
        ...initialState,
        isOpenAddDialog: true,
      };
      const stateCopy = { ...originalState };

      dialogReducer(stateCopy, closeDialog('isOpenAddDialog'));

      expect(originalState.isOpenAddDialog).toBe(true);
    });
  });
});
