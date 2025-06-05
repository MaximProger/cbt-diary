import type { TAppDispatch } from '@/store';
import { openDialog } from '@/store/dialogSlice';
import { setDeleteEntryId, setEditEntryId } from '@/store/entrySlice';
import type { IEntry } from '@/types';
import { Button } from 'flowbite-react';
import { useDispatch } from 'react-redux';

interface IProps {
  entry: IEntry;
}

const EntryItem = ({ entry }: IProps) => {
  const dispatch: TAppDispatch = useDispatch();
  const dateObject = new Date(entry.created_at);
  const formattedDate = dateObject
    .toLocaleString('ru-RU', {
      day: 'numeric', // День без ведущего нуля
      month: 'long', // Полное название месяца
      year: 'numeric', // Год полностью
      hour: '2-digit', // Часы с ведущим нулем
      minute: '2-digit', // Минуты с ведущим нулем
      hour12: false, // 24-часовой формат
    })
    .replace(' г. в', ', ');

  const handleDeleteClick = () => {
    dispatch(setDeleteEntryId(entry.id));
    dispatch(openDialog('isOpenDeleteDialog'));
  };

  const handleEditClick = () => {
    dispatch(setEditEntryId(entry.id));
    dispatch(openDialog('isOpenEditDialog'));
  };

  return (
    <div
      className="bg-(--bg-secondary) rounded-[12px] p-[20px] shadow-[0_1px_3px_var(--shadow-light)] 
    border-solid border-[1px] border-(--border-primary) transition-shadow hover:shadow-[0_4px_12px_var(--shadow-medium)]"
    >
      <div className="flex justify-between items-start mb-[16px] gap-[12px]">
        <time className="block text-sm text-(--text-secondary) font-medium">{formattedDate}</time>
        <div className="flex gap-[6px]">
          <Button size="xs" color="green" className="h-7" onClick={handleEditClick}>
            Изменить
          </Button>
          <Button size="xs" color="red" className="h-7" onClick={handleDeleteClick}>
            Удалить
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[16px]">
        <div className="bg-(--bg-quaternary) p-[16px] rounded-[8px] border-[1px] border-solid border-(--border-primary)">
          <div className="font-semibold mb-[8px] text-(--text-quaternary) text-sm">
            Что самое худшее может случиться
          </div>
          <div className="text-(--text-tertiary) text-sm">{entry.worst_case}</div>
        </div>
        <div className="bg-(--bg-quaternary) p-[16px] rounded-[8px] border-[1px] border-solid border-(--border-primary)">
          <div className="font-semibold mb-[8px] text-(--text-quaternary) text-sm">Какие последствия могут быть</div>
          <div className="text-(--text-tertiary) text-sm">{entry.worst_consequences}</div>
        </div>
        <div className="bg-(--bg-quaternary) p-[16px] rounded-[8px] border-[1px] border-solid border-(--border-primary)">
          <div className="font-semibold mb-[8px] text-(--text-quaternary) text-sm">Что я смогу сделать</div>
          <div className="text-(--text-tertiary) text-sm">{entry.what_can_i_do}</div>
        </div>
        <div className="bg-(--bg-quaternary) p-[16px] rounded-[8px] border-[1px] border-solid border-(--border-primary)">
          <div className="font-semibold mb-[8px] text-(--text-quaternary) text-sm">Как я справлюсь</div>
          <div className="text-(--text-tertiary) text-sm">{entry.how_will_i_cope}</div>
        </div>
      </div>
    </div>
  );
};

export default EntryItem;
