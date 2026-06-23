import React from 'react';
import { Secret } from '@/types/vault';
import { SecretCard } from './SecretCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretListProps {
  secrets: Secret[];
  onViewDetails: (secret: Secret) => void;
  onDelete: (id: string) => void;
  onEdit: (secret: Secret) => void;
}

export const SecretList: React.FC<SecretListProps> = ({
  secrets,
  onViewDetails,
  onDelete,
  onEdit
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {secrets.map((secret) => (
          <motion.div
            key={secret.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <SecretCard
              secret={secret}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default SecretList;
