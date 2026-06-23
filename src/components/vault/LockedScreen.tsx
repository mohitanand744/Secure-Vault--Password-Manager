import React, { useState } from 'react';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateMasterPassword } from '@/utils/validators';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';

interface LockedScreenProps {
  vaultExists: boolean;
  onUnlock: (password: string) => Promise<boolean>;
  onCreateVault: (password: string) => Promise<boolean>;
  onReset: () => void;
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

export const LockedScreen: React.FC<LockedScreenProps> = ({
  vaultExists,
  onUnlock,
  onCreateVault,
  onReset
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const pwError = validateMasterPassword(newPassword);
    if (pwError) {
      setForgotError(pwError);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateVault(newPassword);
      setIsForgotOpen(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setForgotError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pwError = validateMasterPassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setIsLoading(true);

    try {
      if (vaultExists) {
        await onUnlock(password);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        await onCreateVault(password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!vaultExists) {
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [vaultExists]);

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-8">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="w-full border-white/5 bg-surface/35 backdrop-blur-lg p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-brand-primary/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 -z-10 h-40 w-40 rounded-full bg-brand-secondary/10 blur-3xl" />

          <div className="flex flex-col items-center text-center">
            <div className="mb-6 rounded-full overflow-hidden w-20 h-20 flex items-center justify-center border-2 border-brand-primary/20 shadow-glow-primary bg-background-alt ring-8 ring-brand-primary/5 select-none">
              <img
                src="/icon.png"
                alt="SecureVault Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-text-primary">
              {vaultExists ? 'Unlock Secure Vault' : 'Initialize Your Vault'}
            </h1>
            <p className="mb-8 text-sm text-text-secondary">
              {vaultExists
                ? 'Enter your master password to unlock your vault.'
                : 'Create a strong master password to secure your passwords. Do not forget it!'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type={showMasterPassword ? 'text' : 'password'}
              label="Master Password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  className="p-1 cursor-pointer text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                  title={showMasterPassword ? 'Hide password' : 'Show password'}
                >
                  {showMasterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {!vaultExists && (
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Master Password"
                placeholder="••••••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 cursor-pointer text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              <span>{vaultExists ? 'Unlock Vault' : 'Create My Vault'}</span>
              {!isLoading && <ArrowRight size={16} className="ml-2" />}
            </Button>
          </form>

          {vaultExists && (
            <div className="mt-8 border-t border-border/40 pt-4 flex justify-center items-center text-sm font-semibold">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl text-center"
      >
        {[
          { title: 'Fully Private', text: 'Your passwords are encrypted on your device. Nobody else can ever see them.' },
          { title: 'Never Saved', text: 'Your master password is never stored anywhere, keeping your data safe from hackers.' },
          { title: 'Auto-Lock Safety', text: 'The vault locks automatically when you refresh the page or close the tab.' }
        ].map((notice, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{
              scale: 1.1
            }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-surface/40 backdrop-blur-md p-4"
          >
            <p className="text-sm font-semibold uppercase text-brand-secondary tracking-wider mb-1">{notice.title}</p>
            <p className="text-sm text-text-secondary">{notice.text}</p>
          </motion.div>
        ))}
      </motion.div>
      <Modal
        isOpen={isForgotOpen}
        onClose={() => {
          setIsForgotOpen(false);
          setForgotError('');
        }}
        title="Forgot Password"
      >
        <motion.form
          onSubmit={handleForgotSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants} className="rounded-xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger leading-relaxed">
            <strong>Warning:</strong> Your passwords are fully encrypted on this device. If you reset your master password, we cannot recover your existing credentials. This action will permanently wipe your current vault and start a fresh, empty one.
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              placeholder="••••••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={forgotError}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="p-1 cursor-pointer text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              type={showConfirmNewPassword ? 'text' : 'password'}
              label="Confirm New Password"
              placeholder="••••••••••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="p-1 cursor-pointer text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showConfirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex w-full gap-3 pt-4 border-t border-border/40 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsForgotOpen(false);
                setForgotError('');
              }}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              isLoading={isLoading}
            >
              Wipe & Reset
            </Button>
          </motion.div>
        </motion.form>
      </Modal>
    </div>
  );
};
export default LockedScreen;
