import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className
}) => {
  if (totalPages <= 1) return null;

  const delta = 1;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push('...');
      }
    }
    return pages.filter((item, index, self) => self.indexOf(item) === index);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/20 ${className || ''}`}>
      <div className="text-sm text-text-secondary">
        Showing <span className="font-semibold text-text-primary">{startItem}</span> to{' '}
        <span className="font-semibold text-text-primary">{endItem}</span> of{' '}
        <span className="font-semibold text-text-primary">{totalItems}</span> credentials
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 h-9 w-9 flex items-center justify-center rounded-xl hover:bg-surface-hover hover:text-text-primary"
        >
          <ChevronLeft size={16} />
        </Button>

        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-lg font-bold text-text-muted select-none">
                ...
              </span>
            );
          }

          const isCurrent = pageNum === currentPage;
          return (
            <Button
              key={`page-${pageNum}`}
              variant={isCurrent ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(pageNum as number)}
              className={`h-9 w-9 flex items-center justify-center rounded-xl font-medium transition-all ${isCurrent
                ? 'shadow-glow-primary'
                : 'hover:bg-surface-hover hover:text-text-primary'
                }`}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 h-9 w-9 flex items-center justify-center rounded-xl hover:bg-surface-hover hover:text-text-primary"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
