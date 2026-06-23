import { EncryptedVaultPayload } from '@/types/vault';
import { VAULT_STORAGE_KEY } from '@/constants/storageKeys';

export function getEncryptedVault(): EncryptedVaultPayload | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(VAULT_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as EncryptedVaultPayload;
  } catch (err) {
    console.error('Failed to parse encrypted vault from localStorage:', err);
    return null;
  }
}

export function saveEncryptedVault(payload: EncryptedVaultPayload): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
}

export function clearEncryptedVault(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VAULT_STORAGE_KEY);
}

export function hasVault(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(VAULT_STORAGE_KEY) !== null;
}
