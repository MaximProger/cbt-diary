import { Spinner } from 'flowbite-react';
interface IProps {
  className?: string;
  wrapperClassName?: string;
}
const Loader = ({ className, wrapperClassName }: IProps) => {
  return (
    <div className={wrapperClassName} data-testid="loader_wrapper">
      <Spinner className={className} aria-label="Идёт загрузка..." data-testid="loader" />
    </div>
  );
};
export default Loader;
