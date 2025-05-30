import { Spinner } from 'flowbite-react';

interface IProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Loader = ({ className, size }: IProps) => {
  return (
    <div className={className}>
      <Spinner aria-label="Идёт загрузка..." size={size} />
    </div>
  );
};

export default Loader;
