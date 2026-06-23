import React from 'react';
import { Secret } from '@/types/vault';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CopyButton } from '../ui/CopyButton';
import { Eye, Trash2, FileText, User, Edit } from 'lucide-react';

interface SecretCardProps {
  secret: Secret;
  onViewDetails: (secret: Secret) => void;
  onDelete: (id: string) => void;
  onEdit: (secret: Secret) => void;
}

export const SecretCard: React.FC<SecretCardProps> = ({
  secret,
  onViewDetails,
  onDelete,
  onEdit
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(secret.id);
  };

  const getDomainLetter = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || '?';
  };

  return (
    <Card
      hoverable
      onClick={() => onViewDetails(secret)}
      className="group relative flex flex-col justify-between overflow-hidden border-border/40 bg-surface/40 backdrop-blur-md p-5 hover:bg-surface-hover/50 cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20 text-sm group-hover:scale-105 transition-transform">
              {getDomainLetter(secret.name)}
            </div>
            <div className="max-w-[160px] sm:max-w-[200px]">
              <h4 className="truncate font-semibold text-text-primary text-sm tracking-tight">
                {secret.name}
              </h4>
              <p className="flex items-center gap-1 text-sm text-text-secondary truncate mt-0.5">
                <User size={10} className="text-text-muted" />
                {secret.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(secret);
              }}
              title="Edit credential"
              className="rounded-2xl p-1.5 text-text-secondary hover:bg-surface-light hover:text-text-primary border border-transparent transition-all cursor-pointer"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete credential"
              className="rounded-2xl p-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger hover:border-danger/20 border border-transparent transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {secret.notes ? (
            <Badge variant="secondary" className="gap-1">
              <FileText size={10} />
              Has Notes
            </Badge>
          ) : null}
          <Badge variant="primary" className="text-[13px]">
            Encrypted
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-3.5 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(secret);
          }}
          className="inline-flex items-center gap-1 text-sm text-brand-secondary hover:text-brand-secondary/80 font-medium transition-colors cursor-pointer"
        >
          <Eye size={12} />
          View Details
        </button>

        <div className="flex items-center gap-1.5">
          <CopyButton value={secret.username} label="User" className="px-2 py-1 text-[13px] scale-95" />
          <CopyButton value={secret.password} label="Pass" className="px-2 py-1 text-[13px] scale-95" />
        </div>
      </div>
    </Card>
  );
};
export default SecretCard;
