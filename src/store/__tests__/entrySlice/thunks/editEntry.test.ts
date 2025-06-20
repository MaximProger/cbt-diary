import { vi } from 'vitest';

// Mock data for an entry to edit
const entryToEdit = {
  id: 39,
  worst_case: 'Updated worst case',
  worst_consequences: 'Updated consequences',
  what_can_i_do: 'Updated actions',
  how_will_i_cope: 'Updated coping strategy',
  created_by: 'user-id-123',
  created_at: '2025-06-19T18:57:00.000+00:00',
};

// Mock response for successful edit
const mockSuccessResponse = {
  data: [entryToEdit],
  error: null,
};

// Mock response for error case
const mockErrorResponse = {
  data: null,
  error: { message: 'Update failed' },
};

describe('editEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should successfully edit an entry', async () => {
    const selectMock = vi.fn().mockResolvedValue(mockSuccessResponse);
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ update: updateMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { editEntry } = await import('../../../entrySlice');

    const dispatch = vi.fn();
    const thunk = editEntry(entryToEdit);
    await thunk(dispatch, () => ({}), null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(editEntry.pending.type);
    expect(end[0].type).toBe(editEntry.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockSuccessResponse.data[0]);
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(updateMock).toHaveBeenCalledWith(entryToEdit);
    expect(eqMock).toHaveBeenCalledWith('id', entryToEdit.id);
    expect(selectMock).toHaveBeenCalled();
  });

  it('should handle error during entry edit', async () => {
    const selectMock = vi.fn().mockResolvedValue(mockErrorResponse);
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ update: updateMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { editEntry } = await import('../../../entrySlice');

    const dispatch = vi.fn();
    const thunk = editEntry(entryToEdit);
    await thunk(dispatch, () => ({}), null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(editEntry.pending.type);
    expect(end[0].type).toBe(editEntry.rejected.type);
    expect(end[0].payload).toBe('Update failed');
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(updateMock).toHaveBeenCalledWith(entryToEdit);
    expect(eqMock).toHaveBeenCalledWith('id', entryToEdit.id);
    expect(selectMock).toHaveBeenCalled();
  });
});
