import { ENTRIES_LIMIT } from '@/constants';
import { vi } from 'vitest';

// Мок ответа от Supabase с данными
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

// Мок ответа для случая, когда записей нет
const emptyResponse = {
  data: [],
  count: 0,
};

describe('fetchEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('должен успешно получать записи с параметрами по умолчанию', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { fetchEntries } = await import('../../../entrySlice');
    const getState = () => ({
      entries: {
        searchTerm: '',
        sortValue: 'new',
      },
    });
    const dispatch = vi.fn();
    const thunk = fetchEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(start[0].type).toBe(fetchEntries.pending.type);
    expect(end[0].type).toBe(fetchEntries.fulfilled.type);
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(0, ENTRIES_LIMIT - 1);
    expect(end[0].payload).toStrictEqual(mockResponse);
  });

  it('должен получать записи в порядке возрастания, если sortValue не "new"', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { fetchEntries } = await import('../../../entrySlice');
    const getState = () => ({
      entries: {
        searchTerm: '',
        sortValue: 'old',
      },
    });
    const dispatch = vi.fn();
    const thunk = fetchEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(start[0].type).toBe(fetchEntries.pending.type);
    expect(end[0].type).toBe(fetchEntries.fulfilled.type);
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, ENTRIES_LIMIT - 1);
    expect(end[0].payload).toStrictEqual(mockResponse);
  });

  it('должен получать записи с применением фильтра поиска', async () => {
    const orMock = vi.fn().mockResolvedValue(mockResponse);
    const rangeMock = vi.fn().mockReturnValue({ or: orMock });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { fetchEntries } = await import('../../../entrySlice');
    const searchTerm = '1111';
    const getState = () => ({
      entries: {
        searchTerm,
        sortValue: 'new',
      },
    });
    const dispatch = vi.fn();
    const thunk = fetchEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(start[0].type).toBe(fetchEntries.pending.type);
    expect(end[0].type).toBe(fetchEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockResponse);
    expect(orMock).toHaveBeenCalledWith(
      `worst_case.ilike.%${searchTerm}%,worst_consequences.ilike.%${searchTerm}%,what_can_i_do.ilike.%${searchTerm}%,how_will_i_cope.ilike.%${searchTerm}%`,
    );
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('должен обрабатывать и возвращать ошибку от Supabase', async () => {
    const errorMessage = 'Database connection failed';
    const error = new Error(errorMessage);
    const rangeMock = vi.fn().mockRejectedValue(error);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { fetchEntries } = await import('../../../entrySlice');
    const getState = () => ({
      entries: {
        searchTerm: '',
        sortValue: 'old',
      },
    });
    const dispatch = vi.fn();
    const thunk = fetchEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(start[0].type).toBe(fetchEntries.pending.type);
    expect(end[0].type).toBe(fetchEntries.rejected.type);
    expect(end[0].error.message).toContain(errorMessage);
  });

  it('должен соблюдать лимит записей (ENTRIES_LIMIT)', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { fetchEntries } = await import('../../../entrySlice');
    const getState = () => ({
      entries: {
        searchTerm: '',
        sortValue: 'new',
      },
    });
    const dispatch = vi.fn();
    const thunk = fetchEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(start[0].type).toBe(fetchEntries.pending.type);
    expect(end[0].type).toBe(fetchEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockResponse);
    expect(rangeMock).toHaveBeenCalledWith(0, ENTRIES_LIMIT - 1);
  });

  it('должен корректно обрабатывать случай, когда записи не найдены', async () => {
    const rangeMock = vi.fn().mockResolvedValue(emptyResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('@/supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { fetchEntries } = await import('../../../entrySlice');
    const getState = () => ({
      entries: {
        searchTerm: '',
        sortValue: 'new',
      },
    });
    const dispatch = vi.fn();
    const thunk = fetchEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(start[0].type).toBe(fetchEntries.pending.type);
    expect(end[0].type).toBe(fetchEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual(emptyResponse);
    expect(end[0].payload.data).toEqual([]);
    expect(end[0].payload.count).toBe(0);
  });
});
