'use client';

import React, { useState } from 'react';
import { useVault } from '@/hooks/useVault';
import { LockedScreen } from './LockedScreen';
import { VaultHeader } from './VaultHeader';
import { UnlockedVault } from './UnlockedVault';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../ui/ConfirmModal';
import { LoadingScreen } from '../ui/LoadingScreen';

export const VaultApp: React.FC = () => {
  const {
    isLocked,
    secrets,
    vaultExists,
    lockVault,
    masterPasswordUnlockFlow,
    createNewVault,
    createSecret,
    updateSecret,
    deleteSecret,
    resetVault,
    generateMockSecrets
  } = useVault();

  const [isDecrypting, setIsDecrypting] = useState(false);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => { }
  });

  const handleResetRequest = () => {
    setConfirmState({
      isOpen: true,
      title: 'Wipe Vault Storage',
      message: 'WARNING: Wiping the vault is permanent. All your stored passwords will be lost forever. Do you wish to proceed?',
      type: 'danger',
      onConfirm: resetVault
    });
  };

  const handleUnlock = async (password: string) => {
    const success = await masterPasswordUnlockFlow(password);
    if (success) {
      setIsDecrypting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDecrypting(false);
    }
    return success;
  };

  const handleCreateVault = async (password: string) => {
    const success = await createNewVault(password);
    if (success) {
      setIsDecrypting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDecrypting(false);
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-brand-primary/20 selection:text-brand-primary relative overflow-x-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-15"
        style={{ backgroundImage: "url('/images/mainbg.png')" }}
      />

      <AnimatePresence mode="wait">
        {isDecrypting ? (
          <motion.div
            key="decrypting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          >
            <LoadingScreen title="Access Granted" message="Decrypting secure credentials" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <VaultHeader
        isLocked={isLocked}
        onLock={lockVault}
        onReset={handleResetRequest}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LockedScreen
                vaultExists={vaultExists}
                onUnlock={handleUnlock}
                onCreateVault={handleCreateVault}
                onReset={handleResetRequest}
              />
            </motion.div>
          ) : (
            <UnlockedVault
              secrets={secrets}
              onCreateSecret={createSecret}
              onUpdateSecret={updateSecret}
              onDeleteSecret={deleteSecret}
              onLock={lockVault}
              onGenerateMockSecrets={generateMockSecrets}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/20 py-4 bg-background-alt/30 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[13px] text-text-muted font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
            <span>All passwords are encrypted before saving</span>
          </div>
          <span>Your passwords are private and stored locally. We never see your password.</span>
        </div>
      </footer>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
      />
    </div>
  );
};

export default VaultApp;
