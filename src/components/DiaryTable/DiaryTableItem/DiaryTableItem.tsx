import { Button, TableCell, TableRow } from 'flowbite-react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import type { TAppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { setDeleteEntryId, setEditEntryId } from '@/store/entrySlice';
import type { IEntry } from '@/types';
import { openDialog } from '@/store/dialogSlice';

interface IProps {
  entry: IEntry;
}

const DiaryTableItem = ({ entry }: IProps) => {
  const dispatch: TAppDispatch = useDispatch();
  const dateObject = new Date(entry.created_at);
  const formattedDate = dateObject
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', ' ');

  const handleDeleteClick = () => {
    dispatch(setDeleteEntryId(entry.id));
    dispatch(openDialog('isOpenDeleteDialog'));
  };

  const handleEditClick = () => {
    dispatch(setEditEntryId(entry.id));
    dispatch(openDialog('isOpenEditDialog'));
  };

  return (
    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{formattedDate}</TableCell>
      <TableCell>{entry.worst_case}</TableCell>
      <TableCell>{entry.worst_consequences}</TableCell>
      <TableCell>{entry.what_can_i_do}</TableCell>
      <TableCell>{entry.how_will_i_cope}</TableCell>
      <TableCell>
        <div className="flex gap-[6px]">
          <Button
            color="green"
            className="w-[32px] h-[32px] cursor-pointer rounded-full p-0"
            size="xs"
            pill
            onClick={handleEditClick}
          >
            <MdOutlineEdit className="w-4 h-4" />
          </Button>
          <Button
            color="red"
            className="w-[32px] h-[32px] cursor-pointer rounded-full p-0"
            size="xs"
            pill
            onClick={handleDeleteClick}
          >
            <MdOutlineDelete className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DiaryTableItem;
