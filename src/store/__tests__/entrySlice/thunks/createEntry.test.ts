import type { IEntryCreate } from '@/types';
import { vi } from 'vitest';

// Mock data for a new entry
const newEntry: IEntryCreate = {
  worst_case: 'New worst case',
  worst_consequences: 'New consequences',
  what_can_i_do: 'New actions',
  how_will_i_cope: 'New coping strategy',
  created_by: 'user-id-123',
  created_at: '2025-06-19T18:57:00.000+00:00',
};

// Mock response for successful creation
const mockSuccessResponse = {
  data: {
    id: 39,
    ...newEntry,
  },
  error: null,
};

// Mock response for error case
const mockErrorResponse = {
  data: null,
  error: { message: 'Insertion failed' },
};

describe('createEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should successfully create an entry', async () => {
    const singleMock = vi.fn().mockResolvedValue(mockSuccessResponse);
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { createEntry } = await import('../../../entrySlice');

    const dispatch = vi.fn();
    const thunk = createEntry(newEntry);
    await thunk(dispatch, () => ({}), null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(createEntry.pending.type);
    expect(end[0].type).toBe(createEntry.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockSuccessResponse.data);
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(insertMock).toHaveBeenCalledWith(newEntry);
    expect(selectMock).toHaveBeenCalled();
    expect(singleMock).toHaveBeenCalled();
  });

  it('should handle error during entry creation', async () => {
    const singleMock = vi.fn().mockResolvedValue(mockErrorResponse);
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { createEntry } = await import('../../../entrySlice');

    const dispatch = vi.fn();
    const thunk = createEntry(newEntry);
    await thunk(dispatch, () => ({}), null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(createEntry.pending.type);
    expect(end[0].type).toBe(createEntry.rejected.type);
    expect(end[0].payload).toBe('Insertion failed'); // Проверяем payload, так как rejectWithValue передает значение сюда
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(insertMock).toHaveBeenCalledWith(newEntry);
    expect(selectMock).toHaveBeenCalled();
    expect(singleMock).toHaveBeenCalled();
  });
});
