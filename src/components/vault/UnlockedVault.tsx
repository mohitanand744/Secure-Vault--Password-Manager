import React, { useState } from 'react';
import { Secret } from '@/types/vault';
import { motion } from 'framer-motion';
import { Plus, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import { SearchBar } from './SearchBar';
import { EmptyVault } from './EmptyVault';
import { NoResults } from './NoResults';
import SecretList from './SecretList';
import { SecretForm } from './SecretForm';
import { SecretDetails } from './SecretDetails';
import { ConfirmModal } from '../ui/ConfirmModal';

interface UnlockedVaultProps {
  secrets: Secret[];
  onCreateSecret: (data: { name: string; username: string; password: string; notes?: string }) => Promise<any>;
  onUpdateSecret: (secret: Secret) => Promise<any>;
  onDeleteSecret: (id: string) => Promise<any>;
  onGenerateMockSecrets: () => Promise<void>;
}

export const UnlockedVault: React.FC<UnlockedVaultProps> = ({
  secrets,
  onCreateSecret,
  onUpdateSecret,
  onDeleteSecret,
  onGenerateMockSecrets
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 9;
  const listTopRef = React.useRef<HTMLDivElement>(null);

  const handleGenerateMock = async () => {
    setIsGenerating(true);
    try {
      await onGenerateMockSecrets();
    } catch (error) {
      console.log('error while generating mock secrets', error);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

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

  const totalPages = Math.ceil(filteredSecrets.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));

  // Sync state if it goes out of bounds (e.g. after deletion)
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedSecrets = filteredSecrets.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


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

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
          {secrets.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleGenerateMock}
              isLoading={isGenerating}
              disabled={isGenerating}
            >
              {!isGenerating && <Sparkles size={16} className="mr-1.5 text-brand-secondary" />}
              Generate Mock Credentials
            </Button>
          )}
          <Button
            onClick={() => {
              setEditingSecret(null);
              setIsFormOpen(true);
            }}
            disabled={isGenerating}
            className="self-start sm:self-center"
          >
            <Plus size={16} className="mr-1.5" />
            Add Secret
          </Button>
        </div>
      </div>

      {secrets.length > 0 && (
        <div ref={listTopRef} className="w-full max-w-xl scroll-mt-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      {secrets.length === 0 ? (
        <EmptyVault
          onAddSecret={() => setIsFormOpen(true)}
          onGenerateMock={onGenerateMockSecrets}
        />
      ) : filteredSecrets.length === 0 ? (
        <NoResults
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      ) : (
        <div className="space-y-8">
          <SecretList
            secrets={paginatedSecrets}
            onViewDetails={setSelectedSecret}
            onDelete={handleDeleteRequest}
            onEdit={handleStartEdit}
          />

          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={filteredSecrets.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
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
