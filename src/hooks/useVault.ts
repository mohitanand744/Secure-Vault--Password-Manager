import { useState, useCallback, useEffect } from 'react';
import { Secret, EncryptedVaultPayload } from '@/types/vault';
import {
  deriveVaultKey,
  encryptVault,
  decryptVault,
  generateSalt
} from '@/lib/crypto/cryptoService';
import {
  getEncryptedVault,
  saveEncryptedVault,
  clearEncryptedVault,
  hasVault
} from '@/lib/storage/vaultStorage';
import { arrayBufferToBase64, base64ToArrayBuffer } from '@/lib/crypto/encoding';
import { VAULT_VERSION, KDF_NAME, HASH_NAME, KDF_ITERATIONS } from '@/lib/crypto/constants';
import { toast } from 'sonner';

export function useVault() {
  const [isLocked, setIsLocked] = useState(true);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [vaultKey, setVaultKey] = useState<CryptoKey | null>(null);
  const [vaultExists, setVaultExists] = useState(false);

  useEffect(() => {
    setVaultExists(hasVault());
  }, []);

  const lockVault = useCallback(() => {
    setSecrets([]);
    setVaultKey(null);
    setIsLocked(true);
    toast.info('Vault locked.');
  }, []);

  const masterPasswordUnlockFlow = useCallback(async (password: string): Promise<boolean> => {
    const payload = getEncryptedVault();
    if (!payload) {
      throw new Error('No existing vault found. Please create one.');
    }

    const saltBuffer = base64ToArrayBuffer(payload.kdf.salt);
    
    const key = await deriveVaultKey(password, new Uint8Array(saltBuffer));

    try {
      const decryptedSecrets = await decryptVault(payload, key);
      
      setSecrets(decryptedSecrets);
      setVaultKey(key);
      setIsLocked(false);
      toast.success('Vault unlocked successfully!');
      return true;
    } catch (err) {
      throw new Error('Invalid master password. Please try again.');
    }
  }, []);

  const createNewVault = useCallback(async (password: string): Promise<boolean> => {
    const saltBytes = generateSalt();
    
    const key = await deriveVaultKey(password, saltBytes);
    
    const initialSecrets: Secret[] = [];
    const encryptionParams = await encryptVault(initialSecrets, key);

    const payload: EncryptedVaultPayload = {
      version: VAULT_VERSION,
      kdf: {
        name: KDF_NAME,
        hash: HASH_NAME,
        iterations: KDF_ITERATIONS,
        salt: arrayBufferToBase64(saltBytes)
      },
      encryption: encryptionParams
    };

    saveEncryptedVault(payload);
    
    setSecrets(initialSecrets);
    setVaultKey(key);
    setIsLocked(false);
    setVaultExists(true);
    toast.success('Vault initialized successfully!');
    return true;
  }, []);

  const createSecret = useCallback(async (
    secretData: Omit<Secret, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Secret> => {
    if (isLocked || !vaultKey) {
      throw new Error('Vault is locked. Decrypt first.');
    }

    const newSecret: Secret = {
      ...secretData,
      id: typeof window !== 'undefined' && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedSecrets = [...secrets, newSecret];
    const payload = getEncryptedVault();
    if (!payload) {
      throw new Error('No vault container initialized in storage.');
    }

    const encryptionParams = await encryptVault(updatedSecrets, vaultKey);
    const updatedPayload: EncryptedVaultPayload = {
      ...payload,
      encryption: encryptionParams
    };

    saveEncryptedVault(updatedPayload);
    setSecrets(updatedSecrets);
    toast.success(`"${newSecret.name}" saved successfully!`);
    return newSecret;
  }, [isLocked, secrets, vaultKey]);

  const updateSecret = useCallback(async (updatedSecret: Secret): Promise<void> => {
    if (isLocked || !vaultKey) {
      throw new Error('Vault is locked. Decrypt first.');
    }

    const updatedSecrets = secrets.map((s) =>
      s.id === updatedSecret.id
        ? { ...updatedSecret, updatedAt: new Date().toISOString() }
        : s
    );

    const payload = getEncryptedVault();
    if (!payload) {
      throw new Error('No vault container initialized in storage.');
    }

    const encryptionParams = await encryptVault(updatedSecrets, vaultKey);
    const updatedPayload: EncryptedVaultPayload = {
      ...payload,
      encryption: encryptionParams
    };

    saveEncryptedVault(updatedPayload);
    setSecrets(updatedSecrets);
    toast.success(`"${updatedSecret.name}" updated successfully!`);
  }, [isLocked, secrets, vaultKey]);

  const deleteSecret = useCallback(async (secretId: string): Promise<void> => {
    if (isLocked || !vaultKey) {
      throw new Error('Vault is locked. Decrypt first.');
    }

    const updatedSecrets = secrets.filter((s) => s.id !== secretId);
    const payload = getEncryptedVault();
    if (!payload) {
      throw new Error('No vault container initialized in storage.');
    }

    const encryptionParams = await encryptVault(updatedSecrets, vaultKey);
    const updatedPayload: EncryptedVaultPayload = {
      ...payload,
      encryption: encryptionParams
    };

    const deletedSecretName = secrets.find((s) => s.id === secretId)?.name || 'Secret';
    saveEncryptedVault(updatedPayload);
    setSecrets(updatedSecrets);
    toast.success(`"${deletedSecretName}" deleted successfully!`);
  }, [isLocked, secrets, vaultKey]);

  const generateMockSecrets = useCallback(async (): Promise<void> => {
    if (isLocked || !vaultKey) {
      throw new Error('Vault is locked. Decrypt first.');
    }

    const mockSecretsData = [
      {
        name: 'Google Account',
        username: 'john.doe@gmail.com',
        password: 'g00gLe_P@ssw0rd_!23',
        notes: 'Personal Gmail account with 2FA enabled.'
      },
      {
        name: 'Netflix',
        username: 'netflix_family',
        password: 'N3tfl1x_Ch1ll_2026',
        notes: 'Shared family subscription plan.'
      },
      {
        name: 'GitHub',
        username: 'johndoe-dev',
        password: 'ghp_SecureToken998877',
        notes: 'Developer personal token and SSH key password.'
      },
      {
        name: 'Spotify Premium',
        username: 'sound_lover',
        password: 'Sp0t1fy_Mel0dy_99!',
        notes: 'Premium duo plan. Next billing on July 10th.'
      },
      {
        name: 'Amazon Prime',
        username: 'shopaholic_john',
        password: 'Amz_Pr1me_Del1very_#1',
        notes: 'Linked with credit card ending in 4321.'
      },
      {
        name: 'Slack',
        username: 'john.d@company.com',
        password: 'Sl@ck_WorkSpace_2026!',
        notes: 'Company workspace access. Remember to use SSO.'
      },
      {
        name: 'Zoom',
        username: 'john.doe.meetings',
        password: 'Zm_Vide0_Conferenc3',
        notes: 'Used for daily team standups and interviews.'
      },
      {
        name: 'Twitter/X',
        username: '@doe_dev',
        password: 'X_Tw1tter_Secured_88',
        notes: 'Social media handle for tech discussions.'
      },
      {
        name: 'Microsoft Office 365',
        username: 'j.doe@outlook.com',
        password: 'M1cr0s0ft_365_Pro',
        notes: 'Academic and professional Office subscription.'
      },
      {
        name: 'Adobe Creative Cloud',
        username: 'design_by_john@adobe.com',
        password: 'Ad0be_Creative_Su1te_!',
        notes: 'Subscription for Photoshop and Premiere Pro.'
      }
    ];

    const newSecrets: Secret[] = mockSecretsData.map((data) => ({
      ...data,
      id: typeof window !== 'undefined' && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const updatedSecrets = [...secrets, ...newSecrets];
    const payload = getEncryptedVault();
    if (!payload) {
      throw new Error('No vault container initialized in storage.');
    }

    const encryptionParams = await encryptVault(updatedSecrets, vaultKey);
    const updatedPayload: EncryptedVaultPayload = {
      ...payload,
      encryption: encryptionParams
    };

    saveEncryptedVault(updatedPayload);
    setSecrets(updatedSecrets);
    toast.success('Generated 10 mock credentials successfully!');
  }, [isLocked, secrets, vaultKey]);

  const resetVault = useCallback(() => {
    clearEncryptedVault();
    setSecrets([]);
    setVaultKey(null);
    setIsLocked(true);
    setVaultExists(false);
    toast.warning('Vault wiped completely.');
  }, []);

  return {
    isLocked,
    secrets,
    vaultExists,
    lockVault,
    masterPasswordUnlockFlow,
    createNewVault,
    createSecret,
    updateSecret,
    deleteSecret,
    resetVault,
    generateMockSecrets
  };
}
