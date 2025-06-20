import entryReducer, { fetchEntries, initialState } from '../entrySlice';

describe('entryReducer', () => {
  it('should change status with "fetchEntries.pending" action', () => {
    const state = entryReducer(initialState, fetchEntries.pending(''));
    expect(state.status).toBe('pending');
    expect(state.error).toBeNull();
  });
  it('should fetch entries with "fetchEntries.fulfilled" action', () => {
    const mockResponse = {
      data: [
        {
          id: 36,
          created_at: '2025-06-06T14:58:17.962+00:00',
          worst_case: '11111',
          worst_consequences: '22222',
          what_can_i_do: '22222',
          how_will_i_cope: '222222',
          created_by: '44b208bd-5c78-4e05-abad-29f3327f925f',
          search_vector: "'11111':1 '22222':2,3 '222222':4",
        },
      ],
      count: 1,
    };

    const state = entryReducer(initialState, fetchEntries.fulfilled(mockResponse, ''));
    expect(state.status).toBe('fulfilled');
    expect(state.isInitialLoading).toBeFalsy();
    expect(state.error).toBeNull();
    expect(state.entries).toEqual(mockResponse.data);
    expect(state.entriesCount).toEqual(mockResponse.count);
  });
  it('should change status and error with "fetchEntries.rejected" action', () => {
    const errorMessage = "Can't fetch";
    const action = {
      type: fetchEntries.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage },
    };

    const state = entryReducer(initialState, action);

    expect(state.status).toBe('rejected');
    expect(state.isInitialLoading).toBeFalsy();
    expect(state.error).toBe(errorMessage);
  });
});
