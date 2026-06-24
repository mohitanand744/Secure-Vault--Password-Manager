import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { PasswordGenerator } from './PasswordGenerator';
import { Wand2, Eye, EyeOff } from 'lucide-react';
import { Secret } from '@/types/vault';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface SecretFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; username: string; password: string; notes?: string }) => Promise<any>;
  editingSecret?: Secret | null;
}

interface FormData {
  name: string;
  username: string;
  password: string;
  notes: string;
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

export const SecretForm: React.FC<SecretFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingSecret = null
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    trigger
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      username: '',
      password: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: editingSecret ? editingSecret.name : '',
        username: editingSecret ? editingSecret.username : '',
        password: editingSecret ? editingSecret.password : '',
        notes: editingSecret ? editingSecret.notes || '' : ''
      });
      setShowPassword(false);
      setShowGenerator(false);
    }
  }, [isOpen, editingSecret, reset]);

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: data.name.trim(),
        username: data.username.trim(),
        password: data.password,
        notes: data.notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPassword = (generatedPass: string) => {
    setValue('password', generatedPass);
    trigger('password');
    setShowGenerator(false);
    setShowPassword(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingSecret ? 'Edit Secret' : 'Add New Secret'}>
      <motion.form
        onSubmit={handleSubmit(onFormSubmit)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div variants={itemVariants}>
          <Input
            type="text"
            label="Secret Name / Application"
            placeholder="e.g. Google Account, GitHub, bank account"
            error={errors.name?.message}
            disabled={isSubmitting}
            {...register('name', { required: 'Secret name is required' })}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            type="text"
            label="Username or Email"
            placeholder="e.g. mail@example.com, developer123"
            error={errors.username?.message}
            disabled={isSubmitting}
            {...register('username', { required: 'Username or email is required' })}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter secret password"
            error={errors.password?.message}
            disabled={isSubmitting}
            autoComplete="new-password"
            {...register('password', { required: 'Password is required' })}
            rightElement={
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 cursor-pointer text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className={`p-1 active:scale-50 cursor-pointer transition-all focus:outline-none ${showGenerator ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                  title="Toggle password generator"
                >
                  <Wand2 size={15} />
                </button>
              </div>
            }
          />
        </motion.div>

        <div className="overflow-hidden !p-0 !m-0">
          <AnimatePresence>
            {showGenerator && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden py-3 space-y-1.5"
              >
                <span className="text-[13px] font-semibold uppercase tracking-wider text-text-muted mb-1 block select-none">Password Generator</span>
                <PasswordGenerator onApply={handleApplyPassword} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div variants={itemVariants}>
          <Textarea
            label="Notes (Optional)"
            placeholder="Add any recovery codes, security questions, or notes here..."
            disabled={isSubmitting}
            {...register('notes')}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 border-t border-border/40 pt-4 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {editingSecret ? 'Save Changes' : 'Save Secret'}
          </Button>
        </motion.div>
      </motion.form>
    </Modal>
  );
};
export default SecretForm;
