import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <main className="container mx-auto px-4 py-6 flex-grow">{children}</main>
  );
};
