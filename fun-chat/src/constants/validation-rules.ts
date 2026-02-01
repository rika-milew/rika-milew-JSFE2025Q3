import { LOGIN_ERRORS, PASSWORD_ERRORS } from './errors';

const LOGIN_LENGTH = 3;
const PASSWORD_LENGTH = 8;

export const VALIDATION_RULES = {
  login: [
    { test: (value: string): boolean => value.length > 0, error: LOGIN_ERRORS.empty },
    {
      test: (value: string): boolean => value.length >= LOGIN_LENGTH,
      error: LOGIN_ERRORS.tooShort,
    },
    {
      test: (value: string): boolean => /^[a-zA-Z0-9-]+$/.test(value),
      error: LOGIN_ERRORS.invalidChars,
    },
  ],
  password: [
    { test: (value: string): boolean => value.length > 0, error: PASSWORD_ERRORS.empty },
    {
      test: (value: string): boolean => value.length >= PASSWORD_LENGTH,
      error: PASSWORD_ERRORS.tooShort,
    },
    { test: (value: string): boolean => /[A-Z]/.test(value), error: PASSWORD_ERRORS.noUpper },
    { test: (value: string): boolean => /[a-z]/.test(value), error: PASSWORD_ERRORS.noLower },
    { test: (value: string): boolean => /[0-9]/.test(value), error: PASSWORD_ERRORS.noDigit },
    {
      test: (value: string): boolean => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      error: PASSWORD_ERRORS.noSpecial,
    },
    {
      test: (value: string, login?: string): boolean => value !== login,
      error: PASSWORD_ERRORS.sameAsLogin,
    },
    {
      test: (value: string): boolean =>
        /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(value),
      error: PASSWORD_ERRORS.invalidChars,
    },
  ],
};
