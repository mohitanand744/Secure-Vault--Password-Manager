import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/40 bg-surface/45 backdrop-blur-md px-5 py-4 shadow-card transition-all duration-200',
        {
          'hover:bg-surface-hover/50 hover:border-brand-primary/35 hover:shadow-glow-primary hover:-translate-y-0.5': hoverable,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
