import { Label } from 'flowbite-react';
import type { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  id?: string;
}

const DialogLabel = ({ children, id }: IProps) => {
  return (
    <Label className="mb-2 block text-(--text-quaternary) font-semibold" htmlFor={id}>
      {children}
    </Label>
  );
};

export default DialogLabel;
