import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface NoResultsProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({ searchQuery, onClearSearch }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface/20 py-16 px-6 text-center backdrop-blur-md shadow-card max-w-xl mx-auto"
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut'
        }}
        className="mb-5 rounded-full bg-danger/5 p-4 text-danger border border-danger/10 shadow-glow-danger select-none"
      >
        <SearchX size={32} />
      </motion.div>

      <h3 className="mb-2 text-base font-semibold text-text-primary">No search results</h3>
      <p className="mx-auto mb-6 max-w-sm text-sm text-text-secondary leading-relaxed">
        No records match "<span className="font-semibold text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 rounded-md border border-brand-secondary/20 break-all inline-block">{searchQuery}</span>". Try checking your spelling or clear the filter.
      </p>

      <Button
        variant="secondary"
        size="sm"
        onClick={onClearSearch}
        className="hover:shadow-glow-secondary border border-border/30 hover:border-text-secondary/20 transition-all duration-200"
      >
        <X size={14} className="mr-1.5" />
        Clear Search
      </Button>
    </motion.div>
  );
};

export default NoResults;
