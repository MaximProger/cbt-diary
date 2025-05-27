import type { ReactNode } from 'react';
import Container from '../Container/Container';

interface IProps {
  children: ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <div className="bg-slate-100 min-h-screen flex justify-center py-10">
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
