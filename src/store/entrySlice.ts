import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IEntry, IEntryCreate } from '../types';
import { supabase } from '../supabaseClient';

export const fetchEntries = createAsyncThunk('entries/fetchEntries', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('catostrafization_entries')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    return rejectWithValue(error.message);
  }

  return data;
});

export const createEntry = createAsyncThunk('entries/createEntry', async (entry: IEntryCreate, { rejectWithValue }) => {
  const { data, error } = await supabase.from('catostrafization_entries').insert(entry).select().single();
  if (error) {
    return rejectWithValue(error.message);
  }

  return data;
});

export const deleteEntry = createAsyncThunk('entries/deleteEntry', async (id: number, { rejectWithValue }) => {
  console.log(id);

  const { error } = await supabase.from('catostrafization_entries').delete().match({ id });

  if (error) {
    return rejectWithValue(error.message);
  }

  return id;
});

interface IInitialState {
  entries: IEntry[];
  status: 'pending' | 'fulfilled' | 'rejected' | null;
  error: string | null;
  deleteEntryId: number | null;
}

const initialState: IInitialState = {
  entries: [],
  status: null,
  error: null,
  deleteEntryId: null,
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
    addEntry: (state, action) => {
      state.entries.unshift(action.payload);
    },
    setDeleteEntryId: (state, action) => {
      state.deleteEntryId = action.payload;
    },
    clearDeleteEntryId: (state) => {
      state.deleteEntryId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEntries.pending, (state) => {
      state.status = 'pending';
      state.error = null;
    });
    builder.addCase(fetchEntries.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.entries = action.payload;
    });
    builder.addCase(fetchEntries.rejected, (state, action) => setError(state, action));
    builder.addCase(createEntry.fulfilled, (state, action) => {
      state.entries.unshift(action.payload);
    });
    builder.addCase(deleteEntry.fulfilled, (state, action) => {
      console.log(action.payload);

      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    });
  },
});

export const { addEntry, setDeleteEntryId, clearDeleteEntryId } = entrySlice.actions;
export default entrySlice.reducer;
