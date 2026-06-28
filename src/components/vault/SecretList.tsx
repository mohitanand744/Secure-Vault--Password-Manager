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

const SecretList: React.FC<SecretListProps> = ({
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
            initial={{ scale: 0.5, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.25, y: -10 }}
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
