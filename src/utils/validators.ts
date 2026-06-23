export interface SecretFormErrors {
  name?: string;
  username?: string;
  password?: string;
}

export function validateSecretForm(data: {
  name: string;
  username: string;
  password: string;
}): SecretFormErrors {
  const errors: SecretFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Secret name is required';
  }
  
  if (!data.username.trim()) {
    errors.username = 'Username or email is required';
  }
  
  if (!data.password.trim()) {
    errors.password = 'Password is required';
  }

  return errors;
}

export function validateMasterPassword(password: string): string | null {
  if (!password) {
    return 'Master password is required';
  }
  
  if (password.length < 8) {
    return 'Master password must be at least 8 characters long';
  }
  
  return null;
}
