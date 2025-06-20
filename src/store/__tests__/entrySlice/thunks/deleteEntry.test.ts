import { vi } from 'vitest';

// Mock response for successful deletion
const mockSuccessResponse = {
  error: null,
};

// Mock response for error case
const mockErrorResponse = {
  error: { message: 'Deletion failed' },
};

describe('deleteEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should successfully delete an entry', async () => {
    const matchMock = vi.fn().mockResolvedValue(mockSuccessResponse);
    const deleteMock = vi.fn().mockReturnValue({ match: matchMock });
    const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { deleteEntry } = await import('../../../entrySlice');
    const entryId = 39;

    const dispatch = vi.fn();
    const thunk = deleteEntry(entryId);
    await thunk(dispatch, () => ({}), null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(deleteEntry.pending.type);
    expect(end[0].type).toBe(deleteEntry.fulfilled.type);
    expect(end[0].payload).toBe(entryId);
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(deleteMock).toHaveBeenCalled();
    expect(matchMock).toHaveBeenCalledWith({ id: entryId });
  });

  it('should handle error during entry deletion', async () => {
    const matchMock = vi.fn().mockResolvedValue(mockErrorResponse);
    const deleteMock = vi.fn().mockReturnValue({ match: matchMock });
    const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { deleteEntry } = await import('../../../entrySlice');
    const entryId = 39;

    const dispatch = vi.fn();
    const thunk = deleteEntry(entryId);
    await thunk(dispatch, () => ({}), null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(deleteEntry.pending.type);
    expect(end[0].type).toBe(deleteEntry.rejected.type);
    expect(end[0].payload).toBe('Deletion failed');
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(deleteMock).toHaveBeenCalled();
    expect(matchMock).toHaveBeenCalledWith({ id: entryId });
  });
});
