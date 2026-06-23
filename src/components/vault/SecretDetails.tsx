import React, { useState, useEffect } from 'react';
import { Secret } from '@/types/vault';
import { Modal } from '../ui/Modal';
import { CopyButton } from '../ui/CopyButton';
import { Eye, EyeOff, Calendar, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface SecretDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  secret: Secret | null;
  onEdit: (secret: Secret) => void;
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

export const SecretDetails: React.FC<SecretDetailsProps> = ({
  isOpen,
  onClose,
  secret,
  onEdit
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeSecret, setActiveSecret] = useState<Secret | null>(secret);

  useEffect(() => {
    if (secret) {
      setActiveSecret(secret);
      setShowPassword(false);
    }
  }, [secret]);

  const displaySecret = isOpen ? secret : activeSecret;

  if (!displaySecret) return null;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Credential Details">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <span className="text-[13px] font-semibold uppercase tracking-wider text-text-muted">Secret Name</span>
            <h4 className="text-lg font-bold text-text-primary mt-1">{displaySecret.name}</h4>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(displaySecret)}
            className="flex items-center gap-1.5 h-8 px-2.5 text-sm text-text-secondary hover:text-text-primary shrink-0 ml-4"
          >
            <Edit size={12} />
            <span>Edit</span>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-text-muted">Username / Email</span>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-background-alt px-3.5 py-2.5">
            <span className="text-sm font-medium text-text-primary select-all truncate pr-4">
              {displaySecret.username}
            </span>
            <CopyButton value={displaySecret.username} label="Copy" className="shrink-0" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-text-muted">Password</span>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-background-alt px-3.5 py-2.5">
            <span className="text-sm font-mono text-text-primary select-all truncate pr-4">
              {showPassword ? displaySecret.password : '••••••••••••••••'}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-2xl p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <CopyButton value={displaySecret.password} label="Copy" />
            </div>
          </div>
        </motion.div>

        {displaySecret.notes && (
          <motion.div variants={itemVariants} className="space-y-1.5">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-text-muted">Notes</span>
            <div className="relative rounded-2xl border border-border bg-background-alt px-3.5 py-3 text-sm text-text-primary min-h-[60px] whitespace-pre-wrap">
              {displaySecret.notes}
              <div className="absolute right-3.5 top-3">
                <CopyButton value={displaySecret.notes} className="scale-90" />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="border-t border-border/40 pt-4 flex flex-col gap-1.5 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-text-muted" />
            <span>Created: {formatDate(displaySecret.createdAt)}</span>
          </div>
          {displaySecret.updatedAt !== displaySecret.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-text-muted" />
              <span>Last updated: {formatDate(displaySecret.updatedAt)}</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </Modal>
  );
};
export default SecretDetails;
