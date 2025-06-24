import { Label } from 'flowbite-react';
import type { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  htmlFor?: string;
}

const DialogLabel = ({ children, htmlFor }: IProps) => {
  return (
    <Label className="mb-2 block text-(--text-quaternary) font-semibold" htmlFor={htmlFor}>
      {children}
    </Label>
  );
};

export default DialogLabel;
