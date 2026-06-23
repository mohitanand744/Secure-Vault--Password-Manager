import React from 'react';
import { Lock, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface VaultHeaderProps {
  isLocked: boolean;
  onLock: () => void;
  onReset: () => void;
}

export const VaultHeader: React.FC<VaultHeaderProps> = ({
  isLocked,
  onLock,
  onReset
}) => {
  const handleReset = () => {
    onReset();
  };

  return (
    <header className="border-b border-border bg-surface/30 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl overflow-hidden w-9 h-9 flex items-center justify-center border border-white/10 shadow-glow-primary bg-background-alt shrink-0 select-none">
              <img
                src="/icon.png"
                alt="SecureVault Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-text-primary">
                Secure<span className="text-brand-primary">Vault</span>
              </span>
              <span className="ml-2 hidden sm:inline-flex items-center rounded bg-success/10 px-1.5 py-0.5 text-[11px] font-semibold text-success border border-success/20">
                <Lock size={12} className="mr-1.5 text-text-success" />
                SECURE
              </span>
            </div>
          </div>

          {!isLocked && (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-1.5 text-sm text-text-secondary mr-2">
                <ShieldCheck size={14} className="text-success" />
                <span>Unlocked & Secure</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="h-9 px-3 text-sm"
                onClick={onLock}
              >
                <Lock size={13} className="mr-1.5 text-text-secondary" />
                Lock Vault
              </Button>

              <button
                onClick={handleReset}
                title="Wipe vault and start over"
                className="rounded-2xl border border-border bg-surface-light p-2 text-text-muted hover:text-danger hover:border-danger/30 transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default VaultHeader;
