import entryReducer, {
  setDeleteEntryId,
  clearDeleteEntryId,
  setEditEntryId,
  clearEditEntryId,
  setSearchTerm,
  clearSearchTerm,
  setAscending,
  type IInitialState,
  initialState,
} from '../../entrySlice';

describe('entrySlice', () => {
  describe('initial state', () => {
    it('should return initial state when passed undefined state and empty action', () => {
      const result = entryReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('deleteEntryId actions', () => {
    it('should set delete entry id', () => {
      const entryId = 42;
      const action = setDeleteEntryId(entryId);
      const result = entryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        deleteEntryId: entryId,
      });
    });

    it('should clear delete entry id', () => {
      const stateWithDeleteEntryId: IInitialState = {
        ...initialState,
        deleteEntryId: 5,
      };

      const action = clearDeleteEntryId();
      const result = entryReducer(stateWithDeleteEntryId, action);

      expect(result).toEqual({
        ...stateWithDeleteEntryId,
        deleteEntryId: null,
      });
    });

    it('should handle setting delete entry id to 0', () => {
      const action = setDeleteEntryId(0);
      const result = entryReducer(initialState, action);

      expect(result.deleteEntryId).toBe(0);
    });
  });

  describe('editEntryId actions', () => {
    it('should set edit entry id', () => {
      const entryId = 15;
      const action = setEditEntryId(entryId);
      const result = entryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        editEntryId: entryId,
      });
    });

    it('should clear edit entry id', () => {
      const stateWithEditEntryId: IInitialState = {
        ...initialState,
        editEntryId: 10,
      };

      const action = clearEditEntryId();
      const result = entryReducer(stateWithEditEntryId, action);

      expect(result).toEqual({
        ...stateWithEditEntryId,
        editEntryId: null,
      });
    });
  });

  describe('searchTerm actions', () => {
    it('should set search term', () => {
      const searchQuery = 'important task';
      const action = setSearchTerm(searchQuery);
      const result = entryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        searchTerm: searchQuery,
      });
    });

    it('should clear search term', () => {
      const stateWithSearchTerm: IInitialState = {
        ...initialState,
        searchTerm: 'previous search',
      };

      const action = clearSearchTerm();
      const result = entryReducer(stateWithSearchTerm, action);

      expect(result).toEqual({
        ...stateWithSearchTerm,
        searchTerm: '',
      });
    });

    it('should handle empty string as search term', () => {
      const action = setSearchTerm('');
      const result = entryReducer(initialState, action);

      expect(result.searchTerm).toBe('');
    });

    it('should handle search term with special characters', () => {
      const specialSearchTerm = 'test@#$%^&*()';
      const action = setSearchTerm(specialSearchTerm);
      const result = entryReducer(initialState, action);

      expect(result.searchTerm).toBe(specialSearchTerm);
    });
  });

  describe('sorting actions', () => {
    it('should set ascending sort value', () => {
      const sortValue = 'new';
      const action = setAscending(sortValue);
      const result = entryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        sortValue,
      });
    });

    it('should set descending sort value', () => {
      const sortValue = 'old';
      const action = setAscending(sortValue);
      const result = entryReducer(initialState, action);

      expect(result.sortValue).toBe(sortValue);
    });

    it('should handle different sort values', () => {
      const testCases = ['new', 'old', 'alphabetical'];

      testCases.forEach((sortValue) => {
        const action = setAscending(sortValue);
        const result = entryReducer(initialState, action);
        expect(result.sortValue).toBe(sortValue);
      });
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state when setting delete entry id', () => {
      const originalState = { ...initialState };
      const action = setDeleteEntryId(1);

      entryReducer(initialState, action);

      expect(initialState).toEqual(originalState);
    });

    it('should return new state object reference', () => {
      const action = setDeleteEntryId(1);
      const result = entryReducer(initialState, action);

      expect(result).not.toBe(initialState);
    });
  });

  describe('multiple actions sequence', () => {
    it('should handle multiple actions in sequence', () => {
      let state = initialState;

      state = entryReducer(state, setDeleteEntryId(1));
      expect(state.deleteEntryId).toBe(1);

      state = entryReducer(state, setEditEntryId(2));
      expect(state.editEntryId).toBe(2);
      expect(state.deleteEntryId).toBe(1);

      state = entryReducer(state, setSearchTerm('test'));
      expect(state.searchTerm).toBe('test');
      expect(state.editEntryId).toBe(2);
      expect(state.deleteEntryId).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle unknown action type', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION', payload: 'test' };
      const result = entryReducer(initialState, unknownAction);

      expect(result).toEqual(initialState);
    });

    it('should handle negative entry ids', () => {
      const negativeId = -1;
      const deleteAction = setDeleteEntryId(negativeId);
      const editAction = setEditEntryId(negativeId);

      const deleteResult = entryReducer(initialState, deleteAction);
      const editResult = entryReducer(initialState, editAction);

      expect(deleteResult.deleteEntryId).toBe(negativeId);
      expect(editResult.editEntryId).toBe(negativeId);
    });

    it('should handle very long search terms', () => {
      const longSearchTerm = 'a'.repeat(1000);
      const action = setSearchTerm(longSearchTerm);
      const result = entryReducer(initialState, action);

      expect(result.searchTerm).toBe(longSearchTerm);
    });
  });
});
