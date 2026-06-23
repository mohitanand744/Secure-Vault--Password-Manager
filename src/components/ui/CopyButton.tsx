import React from 'react';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value, className, label }) => {
  const { copied, copy } = useClipboard({ timeout: 5000 });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        copy(value).then((success) => {
          if (success) {
            toast.success(`${label || 'Text'} copied to clipboard (clears in 5s)`);
          }
        });
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-2xl border border-border bg-surface px-2.5 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all duration-150 active:scale-95 cursor-pointer',
        {
          'text-success border-success/30 bg-success/5 hover:bg-success/5 hover:text-success': copied,
        },
        className
      )}
      title={copied ? 'Copied (clears in 5s)' : 'Copy to clipboard'}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label ? <span>{copied ? 'Copied' : label}</span> : null}
    </button>
  );
};
export default CopyButton;
