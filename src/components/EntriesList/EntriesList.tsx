import { Button } from 'flowbite-react';
import EntryItem from './EntryItem/EntryItem';
import { useDispatch, useSelector } from 'react-redux';
import type { TAppDispatch, TRootState } from '@/store';
import type { IEntry } from '@/types';
import { loadMoreEntries } from '@/store/entrySlice';

const EntriesList = () => {
  const entries: IEntry[] = useSelector((state: TRootState) => state.entries.entries);
  const count = useSelector((state: TRootState) => state.entries.entriesCount);
  const dispatch: TAppDispatch = useDispatch();

  const loadMore = () => {
    dispatch(loadMoreEntries());
  };

  return (
    <>
      <div className="flex flex-col gap-[16px] max-md:gap-[12px]">
        {entries.map((entry) => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </div>
      {entries.length < count && (
        <Button color="light" className="mt-[32px] mx-auto max-md:mt-[16px]" onClick={loadMore}>
          Показать ещё записи
        </Button>
      )}
    </>
  );
};

export default EntriesList;
