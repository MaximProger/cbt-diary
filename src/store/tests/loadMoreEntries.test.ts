import { vi } from 'vitest';
import { ENTRIES_LIMIT } from '@/constants'; // Используем реальную константу вместо мока

// Мок данных для начального состояния
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

// Мок ответа от Supabase
const mockResponse = {
  data: [
    {
      id: 37,
      created_at: '2025-06-06T14:58:17.962+00:00',
      worst_case: '11111',
      worst_consequences: '22222',
      what_can_i_do: '22222',
      how_will_i_cope: '222222',
      created_by: '44b208bd-5c78-4e05-abad-29f3327f925f',
      search_vector: "'11111':1 '22222':2,3 '222222':4",
    },
    {
      id: 38,
      created_at: '2025-06-06T14:58:17.962+00:00',
      worst_case: '11111',
      worst_consequences: '22222',
      what_can_i_do: '22222',
      how_will_i_cope: '222222',
      created_by: '44b208bd-5c78-4e05-abad-29f3327f925f',
      search_vector: "'11111':1 '22222':2,3 '222222':4",
    },
  ],
};

// Мок для пустого ответа
const emptyResponse = {
  data: [],
};

describe('loadMoreEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('должен успешно загружать записи с параметрами по умолчанию', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const getState = () => ({
      entries: {
        entries,
        searchTerm: '',
        sortValue: 'new',
      },
    });

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual({ data: mockResponse.data });
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(1, 1 + ENTRIES_LIMIT - 1);
  });

  it('должен успешно загружать записи с поисковым запросом', async () => {
    const orMock = vi.fn().mockResolvedValue(mockResponse);
    const rangeMock = vi.fn().mockReturnValue({ or: orMock });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const searchTerm = '1111';
    const getState = () => ({
      entries: {
        entries,
        searchTerm,
        sortValue: 'new',
      },
    });

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual({ data: mockResponse.data });
    expect(rangeMock).toHaveBeenCalledWith(1, 1 + ENTRIES_LIMIT - 1);
    expect(orMock).toHaveBeenCalledWith(
      `worst_case.ilike.%${searchTerm}%,worst_consequences.ilike.%${searchTerm}%,what_can_i_do.ilike.%${searchTerm}%,how_will_i_cope.ilike.%${searchTerm}%`,
    );
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('должен успешно загружать записи с сортировкой по старым записям', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const getState = () => ({
      entries: {
        entries,
        searchTerm: '',
        sortValue: 'old',
      },
    });

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual({ data: mockResponse.data });
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(1, 1 + ENTRIES_LIMIT - 1);
  });

  it('должен обрабатывать пустой ответ от Supabase', async () => {
    const rangeMock = vi.fn().mockResolvedValue(emptyResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const getState = () => ({
      entries: {
        entries: [],
        searchTerm: '',
        sortValue: 'new',
      },
    });

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual({ data: [] });
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(0, 0 + ENTRIES_LIMIT - 1);
  });

  it('должен обрабатывать ошибку от Supabase', async () => {
    const errorMessage = 'Database connection failed';
    const error = new Error(errorMessage);
    const rangeMock = vi.fn().mockRejectedValue(error);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const getState = () => ({
      entries: {
        entries,
        searchTerm: '',
        sortValue: 'new',
      },
    });

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.rejected.type);
    expect(end[0].error.message).toContain(errorMessage);
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(1, 1 + ENTRIES_LIMIT - 1);
  });
});
