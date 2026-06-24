import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#080d1a]/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -270 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 170 }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={cn(
              'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-card flex flex-col max-h-[90vh]',
              className
            )}
          >
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center pointer-events-none opacity-20 rotate-90"
              style={{ backgroundImage: "url('/images/popupBg.png')" }}
            />

            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-background-alt/50">
              <h3 className="text-base font-semibold text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-2xl p-1.5 text-text-secondary hover:bg-surface-light hover:text-text-primary transition-all duration-150 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <motion.div
              layout
              className="overflow-y-auto px-6 py-5 flex-1">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Modal;
