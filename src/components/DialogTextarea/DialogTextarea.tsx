import { Textarea } from 'flowbite-react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface IProps {
  registerProps: UseFormRegisterReturn;
  id?: string;
}

const DialogTextarea = ({ registerProps, id }: IProps) => {
  return (
    <Textarea
      className="bg-(--bg-quaternary) border-[1px] border-solid border-(--border-primary) text-(--text-tertiary) focus:border-(--brand-primary) focus:ring-(--brand-primary) resize-none"
      id={id}
      rows={5}
      {...registerProps}
    />
  );
};

export default DialogTextarea;
