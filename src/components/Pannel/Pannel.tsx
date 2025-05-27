import { Button } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { openDialog } from '../../store/dialogSlice';

const Pannel = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openDialog());
  };

  return (
    <div className="flex items-center">
      <Button className="w-full cursor-pointer" onClick={handleClick}>
        Добавить запись
      </Button>
    </div>
  );
};

export default Pannel;
