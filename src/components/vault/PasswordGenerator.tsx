import React, { useState, useEffect, useCallback } from 'react';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { CopyButton } from '../ui/CopyButton';
import { RefreshCw, Check, CheckSquare, Square, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface PasswordGeneratorProps {
  onApply?: (password: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onApply }) => {
  const { generatePassword } = usePasswordGenerator();
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleGenerate = useCallback(() => {
    const pw = generatePassword({
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
    });
    setGeneratedPassword(pw);
  }, [generatePassword, length, uppercase, lowercase, numbers, symbols]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const toggleOption = (opt: string) => {
    if (opt === 'uppercase') setUppercase(!uppercase);
    if (opt === 'lowercase') setLowercase(!lowercase);
    if (opt === 'numbers') setNumbers(!numbers);
    if (opt === 'symbols') setSymbols(!symbols);
  };

  const getPasswordStrength = () => {
    let checkedCount = 0;
    if (uppercase) checkedCount++;
    if (lowercase) checkedCount++;
    if (numbers) checkedCount++;
    if (symbols) checkedCount++;

    if (length < 10 || checkedCount <= 1) {
      return { label: 'Weak', color: 'bg-danger text-danger', width: 'w-1/3' };
    }
    if (length < 15 || checkedCount <= 2) {
      return { label: 'Medium', color: 'bg-warning text-warning', width: 'w-2/3' };
    }
    return { label: 'Strong', color: 'bg-success text-success', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  const OptionCheckbox = ({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-all duration-150 py-2.5 px-3 rounded-2xl border border-border/30 bg-surface/20 hover:bg-surface/50 cursor-pointer select-none text-left w-full focus:outline-none focus:ring-1 focus:ring-brand-primary/20"
    >
      <span className={checked ? "text-brand-primary" : "text-text-muted"}>
        {checked ? <CheckSquare size={16} /> : <Square size={16} />}
      </span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="rounded-2xl p-3 border border-border bg-background-alt/50 p-4.5 space-y-4 shadow-inner">
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-background-alt px-3.5 py-3 relative overflow-hidden group/pass">
          <span className="font-mono text-sm font-bold text-brand-secondary select-all truncate pr-3 max-w-[220px] sm:max-w-xs tracking-wider">
            {generatedPassword}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-2xl p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all duration-150 cursor-pointer active:scale-90"
              title="Generate new password"
            >
              <RefreshCw size={14} />
            </button>
            <CopyButton value={generatedPassword} />
          </div>
        </div>

        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-[13px] font-semibold text-text-muted select-none">
            <span className="flex items-center gap-1">
              <Shield size={10} />
              Password Strength
            </span>
            <span className={`font-bold uppercase tracking-wider ${strength.color.split(' ')[1]}`}>
              {strength.label}
            </span>
          </div>
          <div className="h-1 w-full bg-border rounded-full overflow-hidden">
            <div className={`h-full ${strength.color.split(' ')[0]} transition-all duration-300 ${strength.width}`} />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex px-1.5 justify-between text-sm font-semibold text-text-secondary select-none">
          <span>Length</span>
          <span className="text-brand-primary">{length} characters</span>
        </div>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-1.5 rounded-2xl appearance-none cursor-pointer focus:outline-none"
          style={{
            background: `linear-gradient(to right, #6366f1 ${((length - 8) / 24) * 100}%, #1e293b ${((length - 8) / 24) * 100}%)`
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-3">
        <OptionCheckbox checked={uppercase} onClick={() => toggleOption('uppercase')} label="Uppercase (A-Z)" />
        <OptionCheckbox checked={lowercase} onClick={() => toggleOption('lowercase')} label="Lowercase (a-z)" />
        <OptionCheckbox checked={numbers} onClick={() => toggleOption('numbers')} label="Numbers (0-9)" />
        <OptionCheckbox checked={symbols} onClick={() => toggleOption('symbols')} label="Symbols (!@#$)" />
      </div>

      {onApply && (
        <Button
          type="button"
          size="sm"
          className="w-full mt-2"
          onClick={() => onApply(generatedPassword)}
        >
          <Check size={14} className="mr-1.5" />
          Use This Password
        </Button>
      )}
    </div>
  );
};
export default PasswordGenerator;
