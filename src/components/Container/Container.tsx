import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Container = ({ children }: IProps) => {
  return (
    <div className="container mx-auto max-w-[1200px] px-4">{children}</div>
  );
};

export default Container;
