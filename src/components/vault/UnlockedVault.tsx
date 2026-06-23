import React, { useState } from 'react';
import { Secret } from '@/types/vault';
import { motion } from 'framer-motion';
import { Plus, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchBar } from './SearchBar';
import { EmptyVault } from './EmptyVault';
import { SecretList } from './SecretList';
import { SecretForm } from './SecretForm';
import { SecretDetails } from './SecretDetails';
import { ConfirmModal } from '../ui/ConfirmModal';

interface UnlockedVaultProps {
  secrets: Secret[];
  onCreateSecret: (data: { name: string; username: string; password: string; notes?: string }) => Promise<any>;
  onUpdateSecret: (secret: Secret) => Promise<any>;
  onDeleteSecret: (id: string) => Promise<any>;
  onLock: () => void;
}

export const UnlockedVault: React.FC<UnlockedVaultProps> = ({
  secrets,
  onCreateSecret,
  onUpdateSecret,
  onDeleteSecret,
  onLock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);

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
    onConfirm: () => {}
  });

  const handleDeleteRequest = (id: string) => {
    const secretName = secrets.find((s) => s.id === id)?.name || 'this credential';
    setConfirmState({
      isOpen: true,
      title: 'Delete Credential',
      message: `Are you sure you want to delete "${secretName}"? This action cannot be undone and the credential will be removed from your secure vault.`,
      type: 'danger',
      onConfirm: () => onDeleteSecret(id)
    });
  };

  const handleStartEdit = (secret: Secret) => {
    setSelectedSecret(null);
    setEditingSecret(secret);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSecret(null);
  };

  const handleFormSubmit = async (data: { name: string; username: string; password: string; notes?: string }) => {
    if (editingSecret) {
      await onUpdateSecret({
        ...editingSecret,
        ...data
      });
    } else {
      await onCreateSecret(data);
    }
  };

  const filteredSecrets = secrets.filter((secret) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      secret.name.toLowerCase().includes(query) ||
      secret.username.toLowerCase().includes(query) ||
      (secret.notes && secret.notes.toLowerCase().includes(query))
    );
  });

  return (
    <motion.div
      key="unlocked"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            Vault Credentials
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Securely managing <span className="font-semibold text-brand-primary">{secrets.length}</span> passwords on your device.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingSecret(null);
            setIsFormOpen(true);
          }}
          className="self-start sm:self-center"
        >
          <Plus size={16} className="mr-1.5" />
          Add Secret
        </Button>
      </div>

      {secrets.length > 0 && (
        <div className="w-full max-w-xl">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      {secrets.length === 0 ? (
        <EmptyVault onAddSecret={() => setIsFormOpen(true)} />
      ) : filteredSecrets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/10 py-12 px-4 text-center">
          <ShieldAlert size={28} className="text-text-muted mb-3" />
          <h4 className="text-sm font-semibold text-text-primary">No search results</h4>
          <p className="text-sm text-text-secondary mt-1 max-w-sm">
            No records match "{searchQuery}". Try updating your query or checking spellings.
          </p>
        </div>
      ) : (
        <SecretList
          secrets={filteredSecrets}
          onViewDetails={setSelectedSecret}
          onDelete={handleDeleteRequest}
          onEdit={handleStartEdit}
        />
      )}

      <SecretForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingSecret={editingSecret}
      />

      <SecretDetails
        isOpen={selectedSecret !== null}
        onClose={() => setSelectedSecret(null)}
        secret={selectedSecret}
        onEdit={handleStartEdit}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
      />
    </motion.div>
  );
};

export default UnlockedVault;
