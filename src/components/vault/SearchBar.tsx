import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex w-full items-center">
      <div className="absolute left-3.5 flex items-center justify-center text-text-muted pointer-events-none">
        <Search size={16} />
      </div>
      <input
        type="text"
        placeholder="Search secrets by name, username, or notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-surface px-10 py-3.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 flex items-center justify-center text-text-muted hover:text-text-primary rounded-md p-1 transition-all active:scale-90"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
