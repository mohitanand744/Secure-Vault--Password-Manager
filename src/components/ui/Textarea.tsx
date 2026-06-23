import React from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label className="text-sm font-semibold uppercase tracking-wider text-text-secondary select-none">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-2xl border border-border bg-background-alt px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[80px]',
            {
              'border-danger focus:border-danger focus:ring-danger': error,
            },
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-sm text-danger font-medium select-none">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
