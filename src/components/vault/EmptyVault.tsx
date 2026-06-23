import React from 'react';
import { Key, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyVaultProps {
  onAddSecret: () => void;
}

export const EmptyVault: React.FC<EmptyVaultProps> = ({ onAddSecret }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/30 px-6 py-16 text-center bg-surface/30 backdrop-blur-md shadow-card">
      <div className="mb-4 rounded-full bg-brand-primary/5 p-4 text-brand-primary border border-brand-primary/10">
        <Key size={32} />
      </div>

      <h3 className="mb-1 text-base font-semibold text-text-primary">No secrets stored</h3>
      <p className="mx-auto mb-6 max-w-sm text-sm text-text-secondary">
        Your vault is currently empty. Get started by securely adding your first password or credential.
      </p>

      <Button onClick={onAddSecret}>
        <Plus size={16} className="mr-1.5" />
        Add Secret
      </Button>
    </div>
  );
};
export default EmptyVault;
