import { Button, createTheme, Select, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { openDialog } from '../../store/dialogSlice';
import { IoSearch } from 'react-icons/io5';
import type { ISearchFormData } from '@/types';
import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { fetchEntries, setAscending, setSearchTerm } from '@/store/entrySlice';
import type { TAppDispatch } from '@/store';

const customTheme = createTheme({
  textInput: {
    field: {
      input: {
        colors: {
          gray: 'bg-(--bg-secondary) border-[1px] border-solid border-(--border-secondary) focus:border-(--brand-primary) focus:ring-(--brand-primary)',
        },
      },
    },
  },
});

const Pannel = () => {
  const dispatch: TAppDispatch = useDispatch();

  const openAddDialog = () => {
    dispatch(openDialog('isOpenAddDialog'));
  };

  const { register, watch } = useForm<ISearchFormData>();

  const searchValue = watch('search');
  const sortValue = watch('sort');
  const prevSortValue = useRef(sortValue);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const trimmedValue = value.trim();
    dispatch(setSearchTerm(trimmedValue));
    dispatch(fetchEntries());
  }, 1000);

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  useEffect(() => {
    if (prevSortValue.current !== sortValue && prevSortValue.current !== undefined) {
      dispatch(setAscending(sortValue));
      dispatch(fetchEntries());
    }
    prevSortValue.current = sortValue;
  }, [dispatch, sortValue]);

  return (
    <div className="bg-(--bg-secondary) rounded-[12px] p-[20px] mb-[24px] shadow-[0_1px_3px_var(--shadow-light)] border-[1px] border-solid border-(--border-primary) max-md:mb-[12px] max-md:p-[12px]">
      <div className="flex gap-[16px] flex-wrap mb-[16px] max-md:gap-[12px] max-md:mb-[12px]">
        <TextInput
          theme={customTheme.textInput}
          className="max-w-full flex-auto"
          icon={IoSearch}
          id="search"
          placeholder="Поиск по записям..."
          inputMode="search"
          {...register('search', { required: true })}
        />
        <Select className="min-w-[180px] max-md:w-full" id="sort" {...register('sort')} required>
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
        </Select>
      </div>
      <Button className="max-md:w-full" size="sm" onClick={openAddDialog}>
        Добавить запись
      </Button>
    </div>
  );
};

export default Pannel;
