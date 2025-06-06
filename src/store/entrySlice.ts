import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IEntry, IEntryCreate } from '../types';
import { supabase } from '../supabaseClient';
import { ENTRIES_LIMIT } from '@/constants';
import type { TRootState } from '.';

export const fetchEntries = createAsyncThunk('entries/fetchEntries', async (_, { rejectWithValue }) => {
  const { data, error, count } = await supabase
    .from('catostrafization_entries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, ENTRIES_LIMIT - 1);

  if (error) {
    return rejectWithValue(error.message);
  }

  return { data, count };
});

export const loadMoreEntries = createAsyncThunk('entries/loadMoreEntries', async (_, { getState, rejectWithValue }) => {
  const state = getState() as TRootState;
  const currentLength = state.entries.entries.length;

  const { data, error } = await supabase
    .from('catostrafization_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .range(currentLength, currentLength + ENTRIES_LIMIT - 1);

  if (error) {
    return rejectWithValue(error.message);
  }

  return { data };
});

export const createEntry = createAsyncThunk('entries/createEntry', async (entry: IEntryCreate, { rejectWithValue }) => {
  const { data, error } = await supabase.from('catostrafization_entries').insert(entry).select().single();
  if (error) {
    return rejectWithValue(error.message);
  }

  return data;
});

export const deleteEntry = createAsyncThunk('entries/deleteEntry', async (id: number, { rejectWithValue }) => {
  const { error } = await supabase.from('catostrafization_entries').delete().match({ id });

  if (error) {
    return rejectWithValue(error.message);
  }

  return id;
});

export const editEntry = createAsyncThunk('entries/editEntry', async (entry: IEntry, { rejectWithValue }) => {
  const { data, error } = await supabase.from('catostrafization_entries').update(entry).eq('id', entry.id).select();

  if (error) {
    return rejectWithValue(error.message);
  }

  return data[0];
});

interface IInitialState {
  entries: IEntry[];
  entriesCount: number;
  status: 'pending' | 'fulfilled' | 'rejected' | null;
  loadMoreStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
  deleteEntryId: number | null;
  editEntryId: number | null;
}

const initialState: IInitialState = {
  entries: [],
  entriesCount: 0,
  loadMoreStatus: 'idle',
  status: null,
  error: null,
  deleteEntryId: null,
  editEntryId: null,
};

const setError = (
  state: IInitialState,
  action: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    type: string;
  },
) => {
  state.status = 'rejected';
  state.error = action.payload;
};

const entrySlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    setDeleteEntryId: (state, action) => {
      state.deleteEntryId = action.payload;
    },
    clearDeleteEntryId: (state) => {
      state.deleteEntryId = null;
    },
    setEditEntryId: (state, action) => {
      state.editEntryId = action.payload;
    },
    clearEditEntryId: (state) => {
      state.editEntryId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEntries.pending, (state) => {
      state.status = 'pending';
      state.error = null;
    });
    builder.addCase(fetchEntries.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.error = null;
      state.entries = action.payload.data;
      state.entriesCount = action.payload.count as number;
    });
    builder.addCase(fetchEntries.rejected, (state, action) => setError(state, action));

    builder.addCase(loadMoreEntries.pending, (state) => {
      state.loadMoreStatus = 'pending';
    });
    builder.addCase(loadMoreEntries.fulfilled, (state, action) => {
      state.loadMoreStatus = 'fulfilled';
      state.entries = [...state.entries, ...action.payload.data]; // добавляем
    });
    builder.addCase(loadMoreEntries.rejected, (state, action) => setError(state, action));

    builder.addCase(createEntry.pending, (state) => {
      state.status = 'pending';
      state.error = null;
    });
    builder.addCase(createEntry.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.error = null;
      state.entries.unshift(action.payload);
    });
    builder.addCase(createEntry.rejected, (state, action) => setError(state, action));

    builder.addCase(deleteEntry.pending, (state) => {
      state.status = 'pending';
      state.error = null;
    });
    builder.addCase(deleteEntry.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.error = null;
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    });
    builder.addCase(deleteEntry.rejected, (state, action) => setError(state, action));

    builder.addCase(editEntry.pending, (state) => {
      state.status = 'pending';
      state.error = null;
    });
    builder.addCase(editEntry.fulfilled, (state, action) => {
      state.entries = state.entries.map((entry) => (entry.id === action.payload.id ? action.payload : entry));
    });
    builder.addCase(editEntry.rejected, (state, action) => setError(state, action));
  },
});

export const { setDeleteEntryId, clearDeleteEntryId, setEditEntryId, clearEditEntryId } = entrySlice.actions;
export default entrySlice.reducer;
