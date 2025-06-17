import { initialState as entryState } from '../entrySlice';
import { initialState as toastState } from '../toastSlice';
import { initialState as dialogState } from '../dialogSlice';
import { initialState as themeState } from '../themeSlice';
import { selectEntries } from '../selectors';

import type { IEntry } from '@/types';

describe('Redux Selectors', () => {
  const createMockState = (entriesData: IEntry[] = []) => ({
    dialogs: dialogState,
    toasts: toastState,
    theme: themeState,
    entries: {
      ...entryState,
      entries: entriesData,
    },
  });

  describe('selectEntries', () => {
    it('should select entries from state object', () => {
      const entries = [
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
      ];

      const state = createMockState(entries);
      const result = selectEntries(state);

      expect(result).toEqual(entries);
    });

    it('should return empty array when no entries exist', () => {
      const state = createMockState();
      const result = selectEntries(state);

      expect(result).toEqual([]);
    });

    it('should handle multiple entries', () => {
      const entries = [
        {
          id: 1,
          created_at: '2025-06-05T10:00:00.000+00:00',
          worst_case: 'Test 1',
          worst_consequences: 'Consequences 1',
          what_can_i_do: 'Action 1',
          how_will_i_cope: 'Cope 1',
          created_by: 'user-1',
          search_vector: "'test':1",
        },
        {
          id: 2,
          created_at: '2025-06-06T11:00:00.000+00:00',
          worst_case: 'Test 2',
          worst_consequences: 'Consequences 2',
          what_can_i_do: 'Action 2',
          how_will_i_cope: 'Cope 2',
          created_by: 'user-2',
          search_vector: "'test':2",
        },
      ];

      const state = createMockState(entries);
      const result = selectEntries(state);

      expect(result).toEqual(entries);
      expect(result).toHaveLength(2);
    });
  });
});
