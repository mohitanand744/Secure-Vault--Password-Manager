export interface Secret {
  id: string;
  name: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KdfParams {
  name: string;
  hash: string;
  iterations: number;
  salt: string;
}

export interface EncryptionParams {
  algorithm: string;
  iv: string;
  ciphertext: string;
}

export interface EncryptedVaultPayload {
  version: number;
  kdf: KdfParams;
  encryption: EncryptionParams;
}
