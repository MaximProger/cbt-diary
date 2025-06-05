import { Button, createTheme, Select, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { openDialog } from '../../store/dialogSlice';
import { IoSearch } from 'react-icons/io5';

const customTheme = createTheme({
  textInput: {
    field: {
      input: {
        colors: {
          gray: 'bg-(--bg-secondary) border-[1px] border-solid border-(--border-secondary) ',
        },
      },
    },
  },
});

const Pannel = () => {
  const dispatch = useDispatch();

  const openAddDialog = () => {
    dispatch(openDialog('isOpenAddDialog'));
  };

  return (
    <div className="bg-(--bg-secondary) rounded-[12px] p-[20px] mb-[24px] shadow-[0_1px_3px_var(--shadow-light)] border-[1px] border-solid border-(--border-primary)">
      <div className="flex gap-[16px] flex-wrap mb-[16px]">
        <TextInput
          theme={customTheme.textInput}
          className="max-w-full flex-auto"
          icon={IoSearch}
          id="search"
          placeholder="Поиск по записям..."
          required
          inputMode="search"
        />
        <Select className="min-w-[180px]" id="sort" required>
          <option>Сначала новые</option>
          <option>Сначала старые</option>
        </Select>
      </div>
      <Button size="sm" onClick={openAddDialog}>
        Добавить запись
      </Button>
    </div>
  );
};

export default Pannel;
