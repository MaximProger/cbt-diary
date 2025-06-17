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
} from '../entrySlice';

describe('entrySlice', () => {
  it('should return default state when  passed an empty action', () => {
    const result = entryReducer(undefined, { type: '' });

    expect(result).toEqual(initialState);
  });

  it('should set delete entry id with "setDeleteEntryId" action', () => {
    const action = { type: setDeleteEntryId.type, payload: 1 };
    const result = entryReducer(initialState, action);
    expect(result.deleteEntryId).toEqual(1);
  });

  it('should clear delete entry id with "clearDeleteEntryId" action', () => {
    const stateWithDeleteEntryId: IInitialState = {
      ...initialState,
      deleteEntryId: 1,
    };
    const action = { type: clearDeleteEntryId.type };
    const result = entryReducer(stateWithDeleteEntryId, action);
    expect(result.deleteEntryId).toBeNull();
  });

  it('should set edit entry id with "setEditEntryId" action', () => {
    const action = { type: setEditEntryId.type, payload: 1 };
    const result = entryReducer(initialState, action);
    expect(result.editEntryId).toEqual(1);
  });

  it('should clear edit entry id with "clearEditEntryId" action', () => {
    const stateWithEditEntryId: IInitialState = {
      ...initialState,
      deleteEntryId: 1,
    };
    const action = { type: clearEditEntryId.type };
    const result = entryReducer(stateWithEditEntryId, action);
    expect(result.editEntryId).toBeNull();
  });

  it('should set search term with "setSearchTerm" action', () => {
    const action = { type: setSearchTerm.type, payload: 'text...' };
    const result = entryReducer(initialState, action);
    expect(result.searchTerm).toBe('text...');
  });

  it('should clear edit entry id with "clearSearchTerm" action', () => {
    const stateWithSearchTerm: IInitialState = {
      ...initialState,
      searchTerm: 'text...',
    };
    const action = { type: clearSearchTerm.type };
    const result = entryReducer(stateWithSearchTerm, action);
    expect(result.searchTerm).toBe('');
  });

  it('should set sort value with "setAscending" action', () => {
    const action = { type: setAscending.type, payload: 'old' };
    const result = entryReducer(initialState, action);
    expect(result.sortValue).toBe('old');
  });
});
