import type { TRootState } from '.';

export const selectEntries = (state: TRootState) => state.entries.entries;
