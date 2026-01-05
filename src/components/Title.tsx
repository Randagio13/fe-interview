import type { JSX } from "react";

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  id?: string;
}

function Title({ children, level = 1, className = "", id }: TitleProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag className={className} id={id} role="heading" aria-level={level}>
      {children}
    </Tag>
  );
}

export { Title };
