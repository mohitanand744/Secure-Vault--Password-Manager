import React, { useState } from 'react';
import { Key, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyVaultProps {
  onAddSecret: () => void;
  onGenerateMock: () => Promise<void>;
}

export const EmptyVault: React.FC<EmptyVaultProps> = ({ onAddSecret, onGenerateMock }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateMock();
    } catch (error) {
      // Error is handled in the parent/hook toast
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/30 px-6 py-16 text-center bg-surface/30 backdrop-blur-md shadow-card">
      <div className="mb-4 rounded-full bg-brand-primary/5 p-4 text-brand-primary border border-brand-primary/10">
        <Key size={32} />
      </div>

      <h3 className="mb-1 text-base font-semibold text-text-primary">No secrets stored</h3>
      <p className="mx-auto mb-6 max-w-sm text-sm text-text-secondary">
        Your vault is currently empty. Get started by securely adding your first password or credential, or populate it with mock testing credentials.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={onAddSecret} disabled={isGenerating}>
          <Plus size={16} className="mr-1.5" />
          Add Secret
        </Button>
        <Button
          variant="secondary"
          onClick={handleGenerate}
          isLoading={isGenerating}
        >
          {!isGenerating && <Sparkles size={16} className="mr-1.5 text-brand-secondary" />}
          Generate Mock Credentials
        </Button>
      </div>
    </div>
  );
};
export default EmptyVault;
