import type { ReactNode } from 'react';
import Container from '../Container/Container';

interface IProps {
  children: ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <div
      className="font-(family-name:--font-roboto)
 bg-(--bg-primary) min-h-screen flex justify-center py-[24px] max-md:py-[12px]"
      data-testid="layout"
    >
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
