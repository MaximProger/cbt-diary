import entryReducer, {
  fetchEntries,
  loadMoreEntries,
  createEntry,
  deleteEntry,
  editEntry,
  initialState,
} from '../../entrySlice';

const mockEntry = {
  id: 36,
  created_at: '2025-06-06T14:58:17.962+00:00',
  worst_case: '11111',
  worst_consequences: '22222',
  what_can_i_do: '22222',
  how_will_i_cope: '222222',
  created_by: '44b208bd-5c78-4e05-abad-29f3327f925f',
  search_vector: "'11111':1 '22222':2,3 '222222':4",
};

const mockEntry2 = {
  id: 37,
  created_at: '2025-06-07T14:58:17.962+00:00',
  worst_case: 'Another case',
  worst_consequences: 'Another consequence',
  what_can_i_do: 'Another action',
  how_will_i_cope: 'Another coping',
  created_by: '44b208bd-5c78-4e05-abad-29f3327f925f',
  search_vector: "'another':1,2,3,4",
};

describe('Entry Slice - Extra Reducers', () => {
  describe('fetchEntries', () => {
    it('should change status with "fetchEntries.pending" action', () => {
      const state = entryReducer(initialState, fetchEntries.pending(''));
      expect(state.status).toBe('pending');
      expect(state.error).toBeNull();
    });

    it('should fetch entries with "fetchEntries.fulfilled" action', () => {
      const mockResponse = {
        data: [mockEntry],
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

  describe('loadMoreEntries', () => {
    it('should change loadMoreStatus with "loadMoreEntries.pending" action', () => {
      const state = entryReducer(initialState, loadMoreEntries.pending(''));
      expect(state.loadMoreStatus).toBe('pending');
    });

    it('should load more entries with "loadMoreEntries.fulfilled" action', () => {
      const stateWithEntries = {
        ...initialState,
        entries: [mockEntry],
      };
      const mockResponse = {
        data: [mockEntry2],
      };

      const state = entryReducer(stateWithEntries, loadMoreEntries.fulfilled(mockResponse, ''));
      expect(state.loadMoreStatus).toBe('fulfilled');
      expect(state.entries).toEqual([mockEntry, mockEntry2]);
      expect(state.entries).toHaveLength(2);
    });

    it('should change status and error with "loadMoreEntries.rejected" action', () => {
      const errorMessage = "Can't load more";
      const action = {
        type: loadMoreEntries.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage },
      };

      const state = entryReducer(initialState, action);

      expect(state.status).toBe('rejected');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('createEntry', () => {
    it('should change status with "createEntry.pending" action', () => {
      const state = entryReducer(initialState, createEntry.pending('', mockEntry));
      expect(state.status).toBe('pending');
      expect(state.error).toBeNull();
    });

    it('should create entry with "createEntry.fulfilled" action', () => {
      const stateWithEntries = {
        ...initialState,
        entries: [mockEntry2],
      };

      const state = entryReducer(stateWithEntries, createEntry.fulfilled(mockEntry, '', mockEntry));
      expect(state.status).toBe('fulfilled');
      expect(state.error).toBeNull();
      expect(state.entries).toEqual([mockEntry, mockEntry2]); // новый элемент добавляется в начало
      expect(state.entries).toHaveLength(2);
    });

    it('should change status and error with "createEntry.rejected" action', () => {
      const errorMessage = "Can't create entry";
      const action = {
        type: createEntry.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage },
      };

      const state = entryReducer(initialState, action);

      expect(state.status).toBe('rejected');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('deleteEntry', () => {
    it('should change status with "deleteEntry.pending" action', () => {
      const state = entryReducer(initialState, deleteEntry.pending('', 36));
      expect(state.status).toBe('pending');
      expect(state.error).toBeNull();
    });

    it('should delete entry with "deleteEntry.fulfilled" action', () => {
      const stateWithEntries = {
        ...initialState,
        entries: [mockEntry, mockEntry2],
      };

      const state = entryReducer(stateWithEntries, deleteEntry.fulfilled(36, '', 1));
      expect(state.status).toBe('fulfilled');
      expect(state.error).toBeNull();
      expect(state.entries).toEqual([mockEntry2]);
      expect(state.entries).toHaveLength(1);
    });

    it('should change status and error with "deleteEntry.rejected" action', () => {
      const errorMessage = "Can't delete entry";
      const action = {
        type: deleteEntry.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage },
      };

      const state = entryReducer(initialState, action);

      expect(state.status).toBe('rejected');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('editEntry', () => {
    it('should change status with "editEntry.pending" action', () => {
      const state = entryReducer(initialState, editEntry.pending('', mockEntry));
      expect(state.status).toBe('pending');
      expect(state.error).toBeNull();
    });

    it('should edit entry with "editEntry.fulfilled" action', () => {
      const stateWithEntries = {
        ...initialState,
        entries: [mockEntry, mockEntry2],
      };

      const editedEntry = {
        ...mockEntry,
        worst_case: 'Updated case',
      };

      const state = entryReducer(stateWithEntries, editEntry.fulfilled(editedEntry, '', mockEntry));
      expect(state.status).toBe('fulfilled');
      expect(state.error).toBeNull();
      expect(state.entries).toEqual([editedEntry, mockEntry2]);
      expect(state.entries).toHaveLength(2);
      expect(state.entries[0].worst_case).toBe('Updated case');
    });

    it('should change status and error with "editEntry.rejected" action', () => {
      const errorMessage = "Can't edit entry";
      const action = {
        type: editEntry.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage },
      };

      const state = entryReducer(initialState, action);

      expect(state.status).toBe('rejected');
      expect(state.error).toBe(errorMessage);
    });
  });
});
