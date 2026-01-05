import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
}

export function Container({ children, className }: Props) {
  return <div className={`poppins-medium ${className}`}>{children}</div>;
}
