import { vi } from 'vitest';

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

describe('loadMoreEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('successful load with default parameters', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../constants', () => ({
      ENTRIES_LIMIT: 2,
    }));

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
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockResponse);
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(rangeMock).toHaveBeenCalledWith(1, 2);
  });
  it('successful load with search term', async () => {
    const orMock = vi.fn().mockResolvedValue(mockResponse);
    const rangeMock = vi.fn().mockReturnValue({ or: orMock });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../constants', () => ({
      ENTRIES_LIMIT: 2,
    }));

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const searchTerm = '1111';
    const getState = () => ({
      entries: {
        entries,
        searchTerm: searchTerm,
        sortValue: 'new',
      },
    });

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockResponse);
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(rangeMock).toHaveBeenCalledWith(1, 2);
    expect(orMock).toHaveBeenCalledWith(
      `worst_case.ilike.%${searchTerm}%,worst_consequences.ilike.%${searchTerm}%,what_can_i_do.ilike.%${searchTerm}%,how_will_i_cope.ilike.%${searchTerm}%`,
    );
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
  });
  it('successful load with non-default sort (oldest first)', async () => {
    const rangeMock = vi.fn().mockResolvedValue(mockResponse);
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../constants', () => ({
      ENTRIES_LIMIT: 2,
    }));

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
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.fulfilled.type);
    expect(end[0].payload).toStrictEqual(mockResponse);
    expect(fromMock).toHaveBeenCalledWith('catostrafization_entries');
    expect(rangeMock).toHaveBeenCalledWith(1, 2);
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: true });
  });
  it('empty response from supabase', async () => {
    const rangeMock = vi.fn().mockResolvedValue({});
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    vi.doMock('../../constants', () => ({
      ENTRIES_LIMIT: 2,
    }));

    vi.doMock('../../supabaseClient', () => ({
      supabase: { from: fromMock },
    }));

    const { loadMoreEntries } = await import('../entrySlice');
    const getState = () => ({});

    const dispatch = vi.fn();
    const thunk = loadMoreEntries();
    await thunk(dispatch, getState, null);

    const { calls } = dispatch.mock;
    expect(calls).toHaveLength(2);
    const [start, end] = calls;
    expect(start[0].type).toBe(loadMoreEntries.pending.type);
    expect(end[0].type).toBe(loadMoreEntries.rejected.type);
    expect(end[0].payload).toBeUndefined();
  });
});
