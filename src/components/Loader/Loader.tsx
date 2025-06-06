import { Spinner } from 'flowbite-react';

interface IProps {
  className?: string;
  wrapperClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Loader = ({ className, wrapperClassName, size }: IProps) => {
  return (
    <div className={wrapperClassName}>
      <Spinner className={className} aria-label="Идёт загрузка..." size={size} />
    </div>
  );
};

export default Loader;
