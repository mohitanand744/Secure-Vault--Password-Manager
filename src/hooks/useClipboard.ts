import { useState, useEffect, useRef } from 'react';

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard({ timeout = 10000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = async (text: string): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          await navigator.clipboard.writeText('');
        } catch (e) {
          console.log('error while clearing clipboard', e);
        }
        setCopied(false);
      }, timeout);

      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setCopied(false);
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy };
}
