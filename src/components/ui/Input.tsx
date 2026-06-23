import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, rightElement, ...props }, ref) => {
    return (
      <motion.div layout className="w-full flex flex-col gap-1.5">
        {label ? (
          <label className="text-sm font-semibold uppercase tracking-wider text-text-secondary select-none">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full rounded-2xl border border-border bg-background-alt px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed',
              {
                'border-danger focus:border-danger focus:ring-danger': error,
                'pr-10': rightElement,
              },
              className
            )}
            {...props}
          />
          {rightElement ? (
            <div className="absolute right-3 flex items-center justify-center text-text-secondary hover:text-text-primary">
              {rightElement}
            </div>
          ) : null}
        </div>
        {error ? (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-sm text-danger font-medium select-none">
            {error}
          </motion.span>
        ) : null}
      </motion.div>
    );
  }
);
Input.displayName = 'Input';
