import { Secret, EncryptedVaultPayload, EncryptionParams } from '@/types/vault';
import {
  KDF_ITERATIONS,
  SALT_LENGTH,
  IV_LENGTH,
  KEY_LENGTH,
  ALGORITHM_NAME,
  HASH_NAME,
  VAULT_VERSION,
  KDF_NAME
} from './constants';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToBuffer,
  bufferToString
} from './encoding';

export function generateSalt(): Uint8Array {
  const salt = new Uint8Array(SALT_LENGTH);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(salt);
  } else {
    const crypto = require('crypto');
    crypto.randomFillSync(salt);
  }
  return salt;
}

export function generateIv(): Uint8Array {
  const iv = new Uint8Array(IV_LENGTH);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(iv);
  } else {
    const crypto = require('crypto');
    crypto.randomFillSync(iv);
  }
  return iv;
}

export async function deriveVaultKey(
  masterPassword: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const cryptoProvider = typeof window !== 'undefined' ? window.crypto : require('crypto').webcrypto;

  const rawKey = await cryptoProvider.subtle.importKey(
    'raw',
    stringToBuffer(masterPassword),
    { name: KDF_NAME },
    false,
    ['deriveKey']
  );

  return await cryptoProvider.subtle.deriveKey(
    {
      name: KDF_NAME,
      salt: salt,
      iterations: KDF_ITERATIONS,
      hash: HASH_NAME
    },
    rawKey,
    {
      name: ALGORITHM_NAME,
      length: KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptVault(
  secrets: Secret[],
  key: CryptoKey
): Promise<EncryptionParams> {
  const cryptoProvider = typeof window !== 'undefined' ? window.crypto : require('crypto').webcrypto;
  const iv = generateIv();
  const plaintext = JSON.stringify(secrets);
  const dataBuffer = stringToBuffer(plaintext);

  const ciphertextBuffer = await cryptoProvider.subtle.encrypt(
    {
      name: ALGORITHM_NAME,
      iv: iv
    },
    key,
    dataBuffer
  );

  return {
    algorithm: ALGORITHM_NAME,
    iv: arrayBufferToBase64(iv),
    ciphertext: arrayBufferToBase64(ciphertextBuffer)
  };
}

export async function decryptVault(
  payload: EncryptedVaultPayload,
  key: CryptoKey
): Promise<Secret[]> {
  const cryptoProvider = typeof window !== 'undefined' ? window.crypto : require('crypto').webcrypto;

  const ivBuffer = base64ToArrayBuffer(payload.encryption.iv);
  const ciphertextBuffer = base64ToArrayBuffer(payload.encryption.ciphertext);

  const decryptedBuffer = await cryptoProvider.subtle.decrypt(
    {
      name: ALGORITHM_NAME,
      iv: ivBuffer
    },
    key,
    ciphertextBuffer
  );

  const plaintext = bufferToString(decryptedBuffer);
  return JSON.parse(plaintext) as Secret[];
}
