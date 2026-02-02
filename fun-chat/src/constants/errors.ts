export const LOGIN_ERRORS = {
  empty: 'Login cannot be empty',
  invalidChars: 'Login can contain only English letters, digits or "-"',
  tooShort: 'Login must be at least 3 characters',
  sameAsPassword: 'Login and password must be different',
  tooLong: 'Login cannot be longer than 15 characters',
};

export const PASSWORD_ERRORS = {
  empty: 'Password cannot be empty',
  tooShort: 'Password must be at least 8 characters long',
  noUpper: 'Password must contain at least one uppercase letter',
  noLower: 'Password must contain at least one lowercase letter',
  noDigit: 'Password must contain at least one digit',
  noSpecial: 'Password must contain at least one special character',
  invalidChars: 'Password can only contain English letters, digits, and special symbols',
  sameAsLogin: 'Password and login must be different',
};

export const SERVER_ERRORS = {
  loginFailed: 'Invalid login or password',
  logoutFailed: 'Failed to log out. Please try again',
  serverError: 'Server error. Please try again',
};
