import { initialState as entryState } from '../entrySlice';
import { initialState as toastState } from '../toastSlice';
import { initialState as dialogState } from '../dialogSlice';
import { initialState as themeState } from '../themeSlice';
import { selectEntries } from '../selectors';

describe('Redux Selectors', () => {
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

    const state = {
      dialogs: dialogState,
      toasts: toastState,
      theme: themeState,
      entries: {
        ...entryState,
        entries,
      },
    };
    const result = selectEntries(state);
    expect(result).toEqual(entries);
  });
});
