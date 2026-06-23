import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'primary', children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-sm font-medium border select-none',
        {
          'bg-brand-primary/10 text-brand-primary border-brand-primary/20': variant === 'primary',
          'bg-surface-light text-text-secondary border-border': variant === 'secondary',
          'bg-success/10 text-success border-success/20': variant === 'success',
          'bg-danger/10 text-danger border-danger/20': variant === 'danger',
          'bg-warning/10 text-warning border-warning/20': variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
