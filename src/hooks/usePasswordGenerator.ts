import { useCallback } from 'react';

export interface GeneratorOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}

export function usePasswordGenerator() {
  const getRandomChar = useCallback((str: string): string => {
    const randomArray = new Uint32Array(1);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomArray);
    } else {
      randomArray[0] = Math.floor(Math.random() * 0xffffffff);
    }
    return str[randomArray[0] % str.length];
  }, []);

  const generatePassword = useCallback((options: GeneratorOptions = {}): string => {
    const {
      length = 16,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true,
    } = options;

    const safeLength = Math.max(8, Math.min(64, length));

    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    let allowedChars = '';
    const guaranteedChars: string[] = [];

    if (uppercase) {
      allowedChars += charSets.uppercase;
      guaranteedChars.push(getRandomChar(charSets.uppercase));
    }
    if (lowercase) {
      allowedChars += charSets.lowercase;
      guaranteedChars.push(getRandomChar(charSets.lowercase));
    }
    if (numbers) {
      allowedChars += charSets.numbers;
      guaranteedChars.push(getRandomChar(charSets.numbers));
    }
    if (symbols) {
      allowedChars += charSets.symbols;
      guaranteedChars.push(getRandomChar(charSets.symbols));
    }

    if (!allowedChars) {
      allowedChars = charSets.lowercase + charSets.numbers;
      guaranteedChars.push(getRandomChar(charSets.lowercase));
      guaranteedChars.push(getRandomChar(charSets.numbers));
    }

    const remainingLength = safeLength - guaranteedChars.length;
    const randomBytes = new Uint32Array(remainingLength);
    
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomBytes);
    } else {
      for (let i = 0; i < remainingLength; i++) {
        randomBytes[i] = Math.floor(Math.random() * 0xffffffff);
      }
    }

    const generatedChars: string[] = [];
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = randomBytes[i] % allowedChars.length;
      generatedChars.push(allowedChars[randomIndex]);
    }

    const allChars = [...guaranteedChars, ...generatedChars];

    const shuffleBytes = new Uint32Array(allChars.length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(shuffleBytes);
    } else {
      for (let i = 0; i < allChars.length; i++) {
        shuffleBytes[i] = Math.floor(Math.random() * 0xffffffff);
      }
    }

    for (let i = allChars.length - 1; i > 0; i--) {
      const j = shuffleBytes[i] % (i + 1);
      const temp = allChars[i];
      allChars[i] = allChars[j];
      allChars[j] = temp;
    }

    return allChars.join('');
  }, [getRandomChar]);

  return { generatePassword };
}
