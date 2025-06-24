import type { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const Container = ({ children }: IProps) => {
  return (
    <div className="container mx-auto max-w-[1200px] px-[24px] max-md:px-[12px]" data-testid="container">
      {children}
    </div>
  );
};

export default Container;
