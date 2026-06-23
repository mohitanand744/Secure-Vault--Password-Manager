import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
  }
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center space-y-4 py-2"
      >
        {type === 'danger' && (
          <motion.div
            variants={itemVariants}
            className="rounded-full bg-danger/10 p-3 text-danger ring-8 ring-danger/5 select-none"
          >
            <AlertTriangle size={24} className="animate-pulse" />
          </motion.div>
        )}
        {type === 'warning' && (
          <motion.div
            variants={itemVariants}
            className="rounded-full bg-warning/10 p-3 text-warning ring-8 ring-warning/5 select-none"
          >
            <AlertTriangle size={24} />
          </motion.div>
        )}
        
        <motion.p variants={itemVariants} className="text-sm text-text-secondary leading-relaxed">
          {message}
        </motion.p>

        <motion.div variants={itemVariants} className="flex w-full gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 cursor-pointer"
          >
            {confirmText}
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};
export default ConfirmModal;
