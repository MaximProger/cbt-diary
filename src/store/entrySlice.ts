import { createSlice } from '@reduxjs/toolkit';
import type { IEntry } from '../types';

const initialState: { entries: IEntry[] } = {
  entries: [
    {
      id: '4fbe57c2-965b-448c-bd15-d2ceea1abf62',
      date: '2025-05-27T11:52:22.774Z',
      worstCase: '978987',
      worstConsequences: '978979',
      whatCanIDo: '78979',
      howWillICope: '987979',
    },
    {
      id: 'd99a5f33-48c1-4779-b46d-37c9b8e8cab1',
      date: '2025-05-27T11:52:18.601Z',
      worstCase: '78979',
      worstConsequences: '97897',
      whatCanIDo: '9879',
      howWillICope: '97897897',
    },
    {
      id: '3c9b0d5f-91c5-4b2c-9cf0-b9a1519cd884',
      date: '2025-05-27T11:51:22.939Z',
      worstCase: '90-09-',
      worstConsequences: '90-9-',
      whatCanIDo: '90-',
      howWillICope: '-90',
    },
    {
      id: '51f2a173-8832-4d5a-8351-426feb809182',
      date: '2025-05-27T11:48:15.002Z',
      worstCase: '5675',
      worstConsequences: '7657',
      whatCanIDo: '56757',
      howWillICope: '765757',
    },
    {
      id: 'e4206e83-63b3-4c7a-9d8e-5a9de150bc31',
      date: '2025-05-27T11:45:37.232Z',
      worstCase: '111',
      worstConsequences: '123',
      whatCanIDo: '434',
      howWillICope: '4343',
    },
    {
      id: 'd56f7903-01ea-4917-922f-94df5909975f',
      date: '2025-05-27T11:45:32.050Z',
      worstCase: '6546',
      worstConsequences: '546',
      whatCanIDo: '6546',
      howWillICope: '654646',
    },
    {
      id: '5ef4bbaf-2fc4-4272-9781-19e587a62ba2',
      date: '2025-05-27T11:45:19.483Z',
      worstCase: '6546',
      worstConsequences: '546',
      whatCanIDo: '6546',
      howWillICope: '654646',
    },
  ],
};

const entrySlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    addEntry: (state, action) => {
      const now = new Date();

      const newEntry = {
        id: crypto.randomUUID(),
        date: now,
        worstCase: action.payload.worstCase,
        worstConsequences: action.payload.worstConsequences,
        whatCanIDo: action.payload.whatCanIDo,
        howWillICope: action.payload.howWillICope,
      };

      state.entries.unshift(newEntry);
    },
  },
});

export const { addEntry } = entrySlice.actions;
export default entrySlice.reducer;
