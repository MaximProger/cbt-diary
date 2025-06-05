import { openDialog } from '@/store/dialogSlice';
import type { Session } from '@supabase/supabase-js';
import { Alert, Button } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa';
import { LuNotepadText } from 'react-icons/lu';
import { useDispatch } from 'react-redux';

const AdditionalContent = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      <p className="text-md text-(--text-tertiary)">
        Начните вести дневник катастрофизации, чтобы отслеживать свои мысли и работать с негативными установками
      </p>
      <Button className="mt-[16px]" size="sm" onClick={onClick}>
        <FaPlus className="mr-2 h-4 w-4" />
        Добавить запись
      </Button>
    </>
  );
};

interface IProps {
  session: Session | null;
}

const NoEntriesAlert = ({ session }: IProps) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(openDialog(session ? 'isOpenAddDialog' : 'isOpenAuthDialog'));
  };

  return (
    <Alert
      additionalContent={<AdditionalContent onClick={handleClick} />}
      color="gray"
      icon={LuNotepadText}
      className="bg-(--bg-secondary) rounded-[12px] p-[20px] shadow-[0_1px_3px_var(--shadow-light)] border-[1px] border-solid border-(--border-primary)"
    >
      <span className="font-medium text-lg">Пока нет записей</span>
    </Alert>
  );
};

export default NoEntriesAlert;
