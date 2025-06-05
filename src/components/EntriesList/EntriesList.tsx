import { Button } from 'flowbite-react';
import EntryItem from './EntryItem/EntryItem';
import { useSelector } from 'react-redux';
import type { TRootState } from '@/store';
import { useState } from 'react';
import type { IEntry } from '@/types';

const DEFAULT_VISIBLE_ENTRIES_LIMIT = 5;

const EntriesList = () => {
  const entries: IEntry[] = useSelector((state: TRootState) => state.entries.entries);

  const [visibleEntriesLimit, setVisibleEntriesLimit] = useState<number>(DEFAULT_VISIBLE_ENTRIES_LIMIT);

  const loadMore = () => {
    setVisibleEntriesLimit((prev) => prev + DEFAULT_VISIBLE_ENTRIES_LIMIT);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-[16px]">
        {entries.slice(0, visibleEntriesLimit).map((entry) => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </div>
      {entries.length > visibleEntriesLimit && (
        <Button color="light" className="mt-[32px] mx-auto" onClick={loadMore}>
          Показать ещё записи
        </Button>
      )}
    </div>
  );
};

export default EntriesList;
