import { LOGIN_ERRORS, PASSWORD_ERRORS } from './errors';

const LOGIN_LENGTH = 3;
const PASSWORD_LENGTH = 8;

export const VALIDATION_RULES = {
  login: [
    { test: (v: string): boolean => v.length > 0, error: LOGIN_ERRORS.empty },
    { test: (v: string): boolean => v.length >= LOGIN_LENGTH, error: LOGIN_ERRORS.tooShort },
    { test: (v: string): boolean => /^[a-zA-Z0-9-]+$/.test(v), error: LOGIN_ERRORS.invalidChars },
  ],
  password: [
    { test: (v: string): boolean => v.length > 0, error: PASSWORD_ERRORS.empty },
    { test: (v: string): boolean => v.length >= PASSWORD_LENGTH, error: PASSWORD_ERRORS.tooShort },
    { test: (v: string): boolean => /[A-Z]/.test(v), error: PASSWORD_ERRORS.noUpper },
    { test: (v: string): boolean => /[a-z]/.test(v), error: PASSWORD_ERRORS.noLower },
    { test: (v: string): boolean => /[0-9]/.test(v), error: PASSWORD_ERRORS.noDigit },
    {
      test: (v: string): boolean => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v),
      error: PASSWORD_ERRORS.noSpecial,
    },
    {
      test: (v: string, login?: string): boolean => v !== login,
      error: PASSWORD_ERRORS.sameAsLogin,
    },
    {
      test: (v: string): boolean => /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(v),
      error: PASSWORD_ERRORS.invalidChars,
    },
  ],
};
