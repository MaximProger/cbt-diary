import { Button, Table, TableBody, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import DiaryTableItem from './DiaryTableItem/DiaryTableItem';
import type { IEntry } from '../../types';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { TRootState } from '../../store';

const DEFAULT_VISIBLE_ENTRIES_LIMIT = 5;

interface IProps {
  user: User;
}

const DiaryTable = ({ user }: IProps) => {
  const entries: IEntry[] = useSelector((state: TRootState) => state.entries.entries);
  console.log('entries', entries);

  const [visibleEntriesLimit, setVisibleEntriesLimit] = useState<number>(DEFAULT_VISIBLE_ENTRIES_LIMIT);

  const loadMore = () => {
    setVisibleEntriesLimit((prev) => prev + DEFAULT_VISIBLE_ENTRIES_LIMIT);
  };

  return (
    entries.length > 0 && (
      <>
        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Дата</TableHeadCell>
                <TableHeadCell>Что самое худшее может случиться в этой ситуации</TableHeadCell>
                <TableHeadCell>Какие самые плохие последствия могут быть у этой ситуации</TableHeadCell>
                <TableHeadCell>Что я смогу сделать в этой ситуации</TableHeadCell>
                <TableHeadCell>Как я справлюсь</TableHeadCell>
                <TableHeadCell></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {entries.slice(0, visibleEntriesLimit).map((entry) => (
                <DiaryTableItem key={entry.id} entry={entry} />
              ))}
            </TableBody>
          </Table>
        </div>
        {entries.length > visibleEntriesLimit && (
          <Button className="mt-10 mx-auto cursor-pointer" onClick={loadMore}>
            Загрузить ещё
          </Button>
        )}
      </>
    )
  );
};

export default DiaryTable;
