import { Button } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { openDialog } from '../../store/dialogSlice';

const Pannel = () => {
  const dispatch = useDispatch();

  const openAddDialog = () => {
    dispatch(openDialog('isOpenAddDialog'));
  };

  return (
    <div className="flex items-center">
      <Button className="w-full cursor-pointer mb-10" onClick={openAddDialog}>
        Добавить запись
      </Button>
    </div>
  );
};

export default Pannel;
